import { ChannelsClient, type ConnectNotice } from "@/components/app/channels-client";
import { getChannelsView } from "@/lib/data";

/** The Instagram callback bounces back here with either ?connected or ?error. */
function readNotice(params: Record<string, string | string[] | undefined>): ConnectNotice | undefined {
  const connected = params.connected;
  if (typeof connected === "string") return { kind: "connected", detail: connected };

  const error = params.error;
  if (typeof error === "string") return { kind: "error", detail: error };

  return undefined;
}

export default async function ChannelsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [view, params] = await Promise.all([getChannelsView(), searchParams]);
  return <ChannelsClient view={view} notice={readNotice(params)} />;
}
