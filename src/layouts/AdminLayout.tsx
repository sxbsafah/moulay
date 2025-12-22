import { AppSidebar } from "@/components/admin/AppSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import useAuth from "@/hooks/useAuth";
import { Navigate } from "react-router";

export default function AdminLayout() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user ||  user.role !== "admin") {
    return <Navigate to="/" />;
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
