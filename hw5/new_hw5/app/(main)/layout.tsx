import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { Sidebar } from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.hasUserID) {
    redirect("/register");
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 mr-80 flex-1">{children}</main>
      <RightSidebar />
    </div>
  );
}

