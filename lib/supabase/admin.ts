import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * Service-role client. Bypasses RLS, so it is the ONLY way to touch
 * channel_credentials — that table has RLS on with no policy precisely so a
 * browser session can never read an access token.
 *
 * Never import this from a Client Component.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient() is server-only — it carries the service role key.");
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !serviceKey) return null;

  return createSupabaseClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
