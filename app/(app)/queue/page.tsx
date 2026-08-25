import { QueueClient } from "@/components/app/queue-client";
import { getQueueView } from "@/lib/data";

export default async function QueuePage() {
  const view = await getQueueView();
  return <QueueClient view={view} />;
}
