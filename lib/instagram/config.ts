/**
 * Instagram API with Business Login for Instagram (graph.instagram.com).
 * Chosen over Facebook Login because it needs no linked Facebook Page — the
 * user signs in with their Instagram credentials alone.
 */

export const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID ?? "";
export const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET ?? "";

/**
 * Meta ships a new Graph version roughly twice a year and supports each for
 * about two years. Pinned rather than left unversioned so a new release cannot
 * silently change behaviour under us; override without a deploy if it ages out.
 */
export const API_VERSION = process.env.INSTAGRAM_API_VERSION ?? "v23.0";

export const GRAPH_HOST = `https://graph.instagram.com/${API_VERSION}`;
export const OAUTH_AUTHORIZE_URL = "https://www.instagram.com/oauth/authorize";
export const OAUTH_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
export const LONG_LIVED_URL = "https://graph.instagram.com/access_token";
export const REFRESH_URL = "https://graph.instagram.com/refresh_access_token";

/** Publishing needs both: basic reads the profile, content_publish posts. */
export const SCOPES = ["instagram_business_basic", "instagram_business_content_publish"];

export const isInstagramConfigured = Boolean(INSTAGRAM_APP_ID && INSTAGRAM_APP_SECRET);

/** Where Meta sends the user back. Must match an entry in the App Dashboard exactly. */
export function redirectUri(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/instagram/callback`;
}

/**
 * A long-lived token lasts 60 days and dies for good if it is not refreshed in
 * that window. Refresh well before the edge rather than at the last moment.
 */
export const TOKEN_TTL_DAYS = 60;
export const REFRESH_WHEN_DAYS_LEFT = 10;
