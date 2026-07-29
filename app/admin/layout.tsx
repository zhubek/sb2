import AdminNav from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminNav />
      <main className="flex-1 overflow-x-auto px-8 py-8">{children}</main>
    </div>
  );
}
