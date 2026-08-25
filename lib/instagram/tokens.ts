import type { SupabaseClient } from "@supabase/supabase-js";
import { REFRESH_WHEN_DAYS_LEFT } from "./config";
import { refreshLongLived } from "./oauth";

export interface ChannelCredential {
  channel_id: string;
  user_id: string;
  external_account_id: string;
  access_token: string;
  token_expires_at: string | null;
}

const DAY_MS = 86400000;

function daysLeft(expiresAt: string | null): number {
  if (!expiresAt) return 0;
  return (new Date(expiresAt).getTime() - Date.now()) / DAY_MS;
}

/**
 * Hands back a token that is safe to publish with, refreshing first when it is
 * close to expiry. A long-lived token that goes 60 days without a refresh dies
 * permanently, so this runs on every publish rather than on a hopeful schedule.
 */
export async function usableToken(
  admin: SupabaseClient,
  credential: ChannelCredential,
): Promise<string> {
  const left = daysLeft(credential.token_expires_at);

  if (left <= 0) {
    throw new Error("The Instagram connection has expired. Reconnect the channel.");
  }
  if (left > REFRESH_WHEN_DAYS_LEFT) {
    return credential.access_token;
  }

  const refreshed = await refreshLongLived(credential.access_token);

  const { error } = await admin
    .from("channel_credentials")
    .update({
      access_token: refreshed.accessToken,
      token_expires_at: refreshed.expiresAt.toISOString(),
      last_refreshed_at: new Date().toISOString(),
    })
    .eq("channel_id", credential.channel_id);

  // The refresh succeeded upstream; failing to persist it is worth shouting
  // about, because the next run would refresh again from a stale token.
  if (error) throw new Error(`Token refreshed but could not be saved: ${error.message}`);

  return refreshed.accessToken;
}
