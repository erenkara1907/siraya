import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { usableToken, type ChannelCredential } from "@/lib/instagram/tokens";
import { publishToInstagram, type MediaType } from "@/lib/instagram/publish";

/** Publishing a video can take a minute of polling; give the run room. */
export const maxDuration = 300;

const BATCH_SIZE = 10;

interface DuePost {
  id: string;
  user_id: string;
  channel_id: string | null;
  platform: string;
  title: string;
  body: string;
  media_url: string | null;
  media_type: string;
  scheduled_at: string;
}

type Admin = NonNullable<ReturnType<typeof createAdminClient>>;

/**
 * Runs on a schedule and publishes whatever has come due. Vercel Cron sends
 * `Authorization: Bearer $CRON_SECRET`; without a match this is a 401, because
 * an open endpoint here would let anyone trigger publishing.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not set." }, { status: 500 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Service role key is not set." }, { status: 500 });

  const { data: due, error } = await admin
    .from("posts")
    .select("id, user_id, channel_id, platform, title, body, media_url, media_type, scheduled_at")
    .eq("status", "scheduled")
    .eq("platform", "instagram")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at")
    .limit(BATCH_SIZE);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: { id: string; ok: boolean; detail: string }[] = [];
  for (const post of (due ?? []) as DuePost[]) {
    results.push(await publishOne(admin, post));
  }

  return NextResponse.json({ considered: results.length, results });
}

async function publishOne(admin: Admin, post: DuePost) {
  const fail = async (detail: string) => {
    await admin.from("posts")
      .update({ status: "failed", failure_error: detail.slice(0, 500), last_attempt_at: new Date().toISOString() })
      .eq("id", post.id);
    await admin.from("activity").insert({
      user_id: post.user_id, actor: "Sıraya", action: "failed",
      target: `Instagram · ${post.title}`, post_id: post.id,
    });
    return { id: post.id, ok: false, detail };
  };

  if (!post.channel_id) return fail("No channel is attached to this post.");
  if (!post.media_url) return fail("Instagram will not accept a post without media.");

  const { data: credential, error: credentialError } = await admin
    .from("channel_credentials")
    .select("channel_id, user_id, external_account_id, access_token, token_expires_at")
    .eq("channel_id", post.channel_id)
    .maybeSingle();

  if (credentialError) return fail(`Could not read the connection: ${credentialError.message}`);
  if (!credential) return fail("That channel is not connected to Instagram.");

  const connection = credential as ChannelCredential;

  try {
    const token = await usableToken(admin, connection);

    const mediaId = await publishToInstagram({
      igUserId: connection.external_account_id,
      accessToken: token,
      mediaUrl: post.media_url,
      caption: [post.title, post.body].filter(Boolean).join("\n\n"),
      mediaType: (post.media_type as MediaType) || "IMAGE",
    });

    await admin.from("posts").update({
      status: "published",
      published_at: new Date().toISOString(),
      external_post_id: mediaId,
      failure_error: null,
      last_attempt_at: new Date().toISOString(),
    }).eq("id", post.id);

    await admin.from("activity").insert({
      user_id: post.user_id, actor: "Sıraya", action: "published",
      target: `Instagram · ${post.title}`, post_id: post.id,
    });

    return { id: post.id, ok: true, detail: mediaId };
  } catch (thrown) {
    return fail(thrown instanceof Error ? thrown.message : "Unknown publishing error.");
  }
}
