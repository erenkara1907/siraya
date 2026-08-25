import { GRAPH_HOST } from "./config";

export type MediaType = "IMAGE" | "REELS" | "STORIES";

/** Instagram's own container states. FINISHED is the only one we may publish. */
type ContainerStatus = "EXPIRED" | "ERROR" | "FINISHED" | "IN_PROGRESS" | "PUBLISHED";

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 20; // ~60s — video transcoding is the slow case.

async function call(url: string, init: RequestInit, context: string): Promise<Record<string, unknown>> {
  const response = await fetch(url, init);
  const text = await response.text();

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(`${context}: non-JSON response (${response.status}): ${text.slice(0, 200)}`);
  }

  const error = body.error as { message?: string; error_user_msg?: string } | undefined;
  if (error) throw new Error(`${context}: ${error.error_user_msg || error.message || JSON.stringify(error)}`);
  if (!response.ok) throw new Error(`${context}: HTTP ${response.status} — ${text.slice(0, 200)}`);

  return body;
}

export interface ContainerInput {
  igUserId: string;
  accessToken: string;
  mediaUrl: string;
  caption: string;
  mediaType: MediaType;
}

/**
 * Step 1 of 2. Instagram fetches `mediaUrl` itself, so it must be reachable
 * from the public internet — a localhost or signed-private URL will fail here.
 */
export async function createContainer(input: ContainerInput): Promise<string> {
  const params = new URLSearchParams({ access_token: input.accessToken, caption: input.caption });

  if (input.mediaType === "IMAGE") {
    params.set("image_url", input.mediaUrl);
  } else {
    params.set("video_url", input.mediaUrl);
    params.set("media_type", input.mediaType);
  }

  const body = await call(
    `${GRAPH_HOST}/${input.igUserId}/media`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params },
    "Creating the media container failed",
  );

  const id = body.id as string | undefined;
  if (!id) throw new Error("Creating the media container failed: no container id returned.");
  return id;
}

export async function containerStatus(containerId: string, accessToken: string) {
  const params = new URLSearchParams({ fields: "status_code,status", access_token: accessToken });
  const body = await call(`${GRAPH_HOST}/${containerId}?${params}`, { method: "GET" }, "Reading container status failed");
  return {
    code: body.status_code as ContainerStatus,
    detail: typeof body.status === "string" ? body.status : undefined,
  };
}

/** Images are usually ready at once; video and reels transcode first. */
export async function waitForContainer(containerId: string, accessToken: string): Promise<void> {
  for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
    const { code, detail } = await containerStatus(containerId, accessToken);

    if (code === "FINISHED") return;
    if (code === "ERROR" || code === "EXPIRED") {
      throw new Error(`Instagram rejected the media (${code})${detail ? `: ${detail}` : ""}`);
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Instagram did not finish processing the media in time.");
}

/** Step 2 of 2. Returns the published media's Instagram id. */
export async function publishContainer(igUserId: string, accessToken: string, creationId: string): Promise<string> {
  const params = new URLSearchParams({ creation_id: creationId, access_token: accessToken });

  const body = await call(
    `${GRAPH_HOST}/${igUserId}/media_publish`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params },
    "Publishing failed",
  );

  const id = body.id as string | undefined;
  if (!id) throw new Error("Publishing failed: no media id returned.");
  return id;
}

/** 100 API-published posts per rolling 24 hours, per account. */
export async function publishingLimit(igUserId: string, accessToken: string) {
  const params = new URLSearchParams({ fields: "config,quota_usage", access_token: accessToken });
  const body = await call(`${GRAPH_HOST}/${igUserId}/content_publishing_limit?${params}`, { method: "GET" }, "Reading the publishing limit failed");

  const row = (body.data as { quota_usage?: number; config?: { quota_total?: number } }[] | undefined)?.[0];
  return { used: row?.quota_usage ?? 0, total: row?.config?.quota_total ?? 100 };
}

/** The whole journey, as the scheduler runs it. */
export async function publishToInstagram(input: ContainerInput): Promise<string> {
  const containerId = await createContainer(input);
  await waitForContainer(containerId, input.accessToken);
  return publishContainer(input.igUserId, input.accessToken, containerId);
}
