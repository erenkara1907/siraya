import {
  GRAPH_HOST, INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, LONG_LIVED_URL,
  OAUTH_AUTHORIZE_URL, OAUTH_TOKEN_URL, REFRESH_URL, SCOPES, redirectUri,
} from "./config";

export interface InstagramProfile {
  user_id: string;
  username: string;
  account_type?: string;
  followers_count?: number;
}

export interface LongLivedToken {
  accessToken: string;
  expiresAt: Date;
}

/** Meta answers errors with 200-and-a-body as often as with a 4xx. Check both. */
async function readJson(response: Response, context: string): Promise<Record<string, unknown>> {
  const text = await response.text();

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(`${context}: Instagram returned a non-JSON response (${response.status}): ${text.slice(0, 200)}`);
  }

  const error = body.error as { message?: string; code?: number } | undefined;
  if (error?.message) throw new Error(`${context}: ${error.message}`);
  if (typeof body.error_message === "string") throw new Error(`${context}: ${body.error_message}`);
  if (!response.ok) throw new Error(`${context}: HTTP ${response.status} — ${text.slice(0, 200)}`);

  return body;
}

/** Step 1 — where we send the user to grant access. */
export function authorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: INSTAGRAM_APP_ID,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: SCOPES.join(","),
    state,
  });
  return `${OAUTH_AUTHORIZE_URL}?${params}`;
}

/** Step 2 — the code is single-use and expires in an hour. */
export async function exchangeCode(code: string): Promise<{ shortToken: string; userId: string }> {
  const response = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      grant_type: "authorization_code",
      redirect_uri: redirectUri(),
      code,
    }),
  });

  const body = await readJson(response, "Code exchange failed");
  const shortToken = body.access_token as string | undefined;
  const userId = body.user_id;

  if (!shortToken) throw new Error("Code exchange failed: no access_token in the response.");
  return { shortToken, userId: String(userId ?? "") };
}

/** Step 3 — swap the ~1 hour token for the 60 day one. */
export async function exchangeForLongLived(shortToken: string): Promise<LongLivedToken> {
  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: INSTAGRAM_APP_SECRET,
    access_token: shortToken,
  });

  const body = await readJson(await fetch(`${LONG_LIVED_URL}?${params}`), "Long-lived token exchange failed");
  return toToken(body, "Long-lived token exchange failed");
}

/** Step 4 — must be at least 24h old and not yet expired. */
export async function refreshLongLived(token: string): Promise<LongLivedToken> {
  const params = new URLSearchParams({ grant_type: "ig_refresh_token", access_token: token });
  const body = await readJson(await fetch(`${REFRESH_URL}?${params}`), "Token refresh failed");
  return toToken(body, "Token refresh failed");
}

function toToken(body: Record<string, unknown>, context: string): LongLivedToken {
  const accessToken = body.access_token as string | undefined;
  const expiresIn = Number(body.expires_in ?? 0);

  if (!accessToken) throw new Error(`${context}: no access_token in the response.`);

  return {
    accessToken,
    expiresAt: new Date(Date.now() + (expiresIn || 60 * 24 * 3600) * 1000),
  };
}

/** Who did we just connect? Used to name the channel. */
export async function fetchProfile(accessToken: string): Promise<InstagramProfile> {
  const params = new URLSearchParams({
    fields: "user_id,username,account_type,followers_count",
    access_token: accessToken,
  });

  const body = await readJson(await fetch(`${GRAPH_HOST}/me?${params}`), "Profile lookup failed");

  return {
    user_id: String(body.user_id ?? body.id ?? ""),
    username: String(body.username ?? ""),
    account_type: body.account_type as string | undefined,
    followers_count: typeof body.followers_count === "number" ? body.followers_count : undefined,
  };
}
