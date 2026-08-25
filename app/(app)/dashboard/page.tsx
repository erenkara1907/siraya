import { DashboardClient } from "@/components/app/dashboard-client";
import { getDashboardView } from "@/lib/data";

export default async function DashboardPage() {
  const view = await getDashboardView();
  return <DashboardClient view={view} />;
}
