import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/Navbar";

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { label: 'Tasks', href: '/officer/tasks' },
    { label: 'Map View', href: '/officer/map' },
    { label: 'Leaderboard', href: '/officer/leaderboard' },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar title="Officer Portal" links={links} />
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-gray-50/30">{children}</main>
      </div>
    </div>
  );
}