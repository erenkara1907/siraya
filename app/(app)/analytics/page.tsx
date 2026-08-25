import { AnalyticsClient } from "@/components/app/analytics-client";
import { getAnalyticsView } from "@/lib/data";

export default async function AnalyticsPage() {
  const view = await getAnalyticsView();
  return <AnalyticsClient view={view} />;
}
