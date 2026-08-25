import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient, getUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TOKEN_TTL_DAYS } from "@/lib/instagram/config";
import { exchangeCode, exchangeForLongLived, fetchProfile } from "@/lib/instagram/oauth";

const STATE_COOKIE = "ig_oauth_state";

function back(origin: string, params: Record<string, string>) {
  const url = new URL(`${origin}/channels`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;

  // The user pressed "Cancel" on Instagram's consent screen.
  const denied = searchParams.get("error");
  if (denied) return back(origin, { error: searchParams.get("error_reason") ?? denied });

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!code) return back(origin, { error: "missing_code" });

  // CSRF: the state must be the one we minted for this browser, and it is
  // single-use — clear it whatever happens next.
  const store = await cookies();
  const expected = store.get(STATE_COOKIE)?.value;
  store.delete(STATE_COOKIE);
  if (!state || !expected || state !== expected) return back(origin, { error: "bad_state" });

  const user = await getUser();
  const supabase = await createClient();
  if (!user || !supabase) return back(origin, { error: "signed_out" });

  // Tokens are written with the service role: channel_credentials is closed to
  // every user session by design.
  const admin = createAdminClient();
  if (!admin) return back(origin, { error: "service_role_missing" });

  try {
    const { shortToken } = await exchangeCode(code);
    const longLived = await exchangeForLongLived(shortToken);
    const profile = await fetchProfile(longLived.accessToken);

    if (!profile.user_id) throw new Error("Instagram did not return an account id.");

    const handle = profile.username ? `@${profile.username}` : `instagram:${profile.user_id}`;

    // Re-connecting the same account must update it, not create a duplicate —
    // channels is unique on (user_id, platform, handle).
    const { data: channel, error: channelError } = await supabase
      .from("channels")
      .upsert(
        {
          user_id: user.id,
          platform: "instagram",
          handle,
          username: profile.username || null,
          external_account_id: profile.user_id,
          followers: profile.followers_count ?? 0,
          is_connected: true,
        },
        { onConflict: "user_id,platform,handle" },
      )
      .select("id")
      .single();

    if (channelError) throw new Error(channelError.message);

    const { error: credentialError } = await admin.from("channel_credentials").upsert({
      channel_id: channel.id,
      user_id: user.id,
      provider: "instagram",
      external_account_id: profile.user_id,
      access_token: longLived.accessToken,
      token_expires_at: longLived.expiresAt.toISOString(),
      last_refreshed_at: new Date().toISOString(),
    });

    if (credentialError) throw new Error(credentialError.message);

    return back(origin, { connected: handle, expires_in_days: String(TOKEN_TTL_DAYS) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return back(origin, { error: message.slice(0, 200) });
  }
}
