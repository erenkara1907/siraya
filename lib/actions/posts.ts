"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";
import { PLATFORM, type Platform, type PostStatus } from "@/lib/demo/data";
import { canPublish } from "@/lib/publishing";

export interface ActionResult { ok: boolean; error?: string }

const PLATFORMS = Object.keys(PLATFORM) as Platform[];
const STATUSES: PostStatus[] = ["draft", "needs_review", "scheduled", "published", "failed"];
const MEDIA_TYPES = ["IMAGE", "REELS", "STORIES"];
const TITLE_MAX = 200;
const BODY_MAX = 5000;

const APP_PATHS = ["/dashboard", "/queue", "/channels", "/analytics"];

function revalidateApp() {
  for (const path of APP_PATHS) revalidatePath(path);
}

/** Everything crossing this boundary is untrusted until it passes here. */
function readPostForm(form: FormData) {
  const platform = String(form.get("platform") ?? "");
  const title = String(form.get("title") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const status = String(form.get("status") ?? "scheduled");
  const scheduledAt = String(form.get("scheduledAt") ?? "").trim();
  const channelId = String(form.get("channelId") ?? "").trim();
  const mediaUrl = String(form.get("mediaUrl") ?? "").trim();
  const mediaType = String(form.get("mediaType") ?? "IMAGE");

  if (!PLATFORMS.includes(platform as Platform)) return { error: "Unknown platform." as const };
  if (!title) return { error: "A title is required." as const };
  if (title.length > TITLE_MAX) return { error: `Title must be under ${TITLE_MAX} characters.` as const };
  if (body.length > BODY_MAX) return { error: `Body must be under ${BODY_MAX} characters.` as const };
  if (!STATUSES.includes(status as PostStatus)) return { error: "Unknown status." as const };
  if (!MEDIA_TYPES.includes(mediaType)) return { error: "Unknown media type." as const };

  // Instagram fetches the file itself, so anything it cannot reach is useless.
  if (mediaUrl && !/^https:\/\//.test(mediaUrl)) {
    return { error: "Media must be at a public https URL." as const };
  }

  let scheduled: string | null = null;
  if (scheduledAt) {
    const parsed = new Date(scheduledAt);
    if (Number.isNaN(parsed.getTime())) return { error: "That date could not be read." as const };
    scheduled = parsed.toISOString();
  }
  if (status === "scheduled" && !scheduled) return { error: "A scheduled post needs a date and time." as const };

  // Only Instagram has a publisher behind it. Letting another platform reach
  // "scheduled" would leave a post sitting in the queue for ever, silently.
  if ((status === "scheduled" || status === "published") && !canPublish(platform as Platform)) {
    return { error: "UNPUBLISHABLE_PLATFORM" as const };
  }

  return {
    value: {
      platform: platform as Platform,
      title,
      body,
      status: status as PostStatus,
      scheduled_at: scheduled,
      channel_id: channelId || null,
      media_url: mediaUrl || null,
      media_type: mediaType,
    },
  };
}

export async function createPost(form: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not connected." };

  const user = await getUser();
  if (!user) return { ok: false, error: "You are signed out." };

  const parsed = readPostForm(form);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const { error } = await supabase.from("posts").insert({ ...parsed.value, user_id: user.id });
  if (error) return { ok: false, error: error.message };

  await supabase.from("activity").insert({
    user_id: user.id,
    actor: parsed.value.status === "draft" ? "—" : "Sıraya",
    action: "queued",
    target: `${PLATFORM[parsed.value.platform].name} · ${parsed.value.title}`,
  });

  revalidateApp();
  return { ok: true };
}

export async function updatePostStatus(id: string, status: PostStatus): Promise<ActionResult> {
  if (!STATUSES.includes(status)) return { ok: false, error: "Unknown status." };

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not connected." };

  const user = await getUser();
  if (!user) return { ok: false, error: "You are signed out." };

  // published_at is what the calendar and analytics read; keep it in step.
  const patch: Record<string, unknown> = { status };
  if (status === "published") patch.published_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("posts").update(patch).eq("id", id).select("platform, title").maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "That post no longer exists." };

  if (status === "scheduled" || status === "published") {
    await supabase.from("activity").insert({
      user_id: user.id,
      actor: "Sıraya",
      action: status === "published" ? "published" : "approved",
      target: `${PLATFORM[data.platform as Platform].name} · ${data.title}`,
      post_id: id,
    });
  }

  revalidateApp();
  return { ok: true };
}

export async function deletePost(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateApp();
  return { ok: true };
}
