import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "@/lib/supabase/server";
import { isInstagramConfigured } from "@/lib/instagram/config";
import { authorizeUrl } from "@/lib/instagram/oauth";

const STATE_COOKIE = "ig_oauth_state";

/** Kicks off the OAuth dance. The state cookie is what makes the callback safe. */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  const user = await getUser();
  if (!user) return NextResponse.redirect(`${origin}/login?next=/channels`);

  if (!isInstagramConfigured) {
    return NextResponse.redirect(`${origin}/channels?error=instagram_not_configured`);
  }

  const state = crypto.randomUUID();
  const store = await cookies();
  store.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(authorizeUrl(state));
}
