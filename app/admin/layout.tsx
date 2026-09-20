import AdminShell from "@/components/admin/shell";
import AdminLogin from "@/components/admin/login";
import { isAdmin, isLocalAdminMode } from "@/lib/cms/auth";
import "@/components/admin/admin.css";
export const dynamic="force-dynamic";
export default async function AdminLayout({children}:{children:React.ReactNode}) {
  if(!await isAdmin())return <AdminLogin local={await isLocalAdminMode()}/>;
  return <AdminShell>{children}</AdminShell>;
}
