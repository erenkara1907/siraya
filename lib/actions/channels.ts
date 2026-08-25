"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";
import { PLATFORM, type Platform } from "@/lib/demo/data";
import type { ActionResult } from "./posts";

const PLATFORMS = Object.keys(PLATFORM) as Platform[];
const HANDLE_MAX = 80;

/**
 * Adds a channel by hand. Real OAuth to Instagram/X/LinkedIn/TikTok is a later
 * step, so a channel added here records who you post as — it does not yet grant
 * publishing rights, and is stored with is_connected false to say so.
 */
export async function createChannel(form: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not connected." };

  const user = await getUser();
  if (!user) return { ok: false, error: "You are signed out." };

  const platform = String(form.get("platform") ?? "");
  const handle = String(form.get("handle") ?? "").trim();
  const followersRaw = String(form.get("followers") ?? "0").trim();

  if (!PLATFORMS.includes(platform as Platform)) return { ok: false, error: "Unknown platform." };
  if (!handle) return { ok: false, error: "A handle is required." };
  if (handle.length > HANDLE_MAX) return { ok: false, error: `Handle must be under ${HANDLE_MAX} characters.` };

  const followers = Number(followersRaw);
  if (!Number.isFinite(followers) || followers < 0) return { ok: false, error: "Followers must be a positive number." };

  const { error } = await supabase.from("channels").insert({
    user_id: user.id,
    platform,
    handle,
    followers: Math.floor(followers),
    is_connected: false,
  });

  if (error) {
    if (error.code === "23505") return { ok: false, error: "That channel is already added." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/channels");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteChannel(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("channels").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/channels");
  revalidatePath("/dashboard");
  return { ok: true };
}
