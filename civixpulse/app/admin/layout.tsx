import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Clusters', href: '/admin/clusters' },
    { label: 'Officers', href: '/admin/officers' },
    { label: 'Analytics', href: '/admin/analytics' },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar title="Command Center" links={links} />
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-gray-50/50">{children}</main>
      </div>
    </div>
  );
}