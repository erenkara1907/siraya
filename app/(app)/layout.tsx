import { Sidebar, type SidebarUser } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { getUser } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authUser = await getUser();

  // Demo mode (or signed out): null, and the sidebar shows its stand-in.
  const user: SidebarUser | null = authUser
    ? {
        name:
          (authUser.user_metadata?.display_name as string) ||
          (authUser.user_metadata?.full_name as string) ||
          (authUser.user_metadata?.name as string) ||
          authUser.email?.split("@")[0] ||
          "—",
        email: authUser.email ?? "",
      }
    : null;

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
