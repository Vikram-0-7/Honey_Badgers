const fs = require('fs');
const path = require('path');

const root = __dirname;

const dirs = [
  'components/ui',
  'app/(citizen)/dashboard',
  'app/(citizen)/portal/submit',
  'app/(citizen)/portal/track/[id]',
  'app/(citizen)/portal/verify/[id]',
  'app/(citizen)/profile',
  'app/officer',
  'app/officer/tasks',
  'app/officer/map',
  'app/officer/tasks/[id]',
  'app/officer/leaderboard',
  'app/admin',
  'app/admin/dashboard',
  'app/admin/clusters',
  'app/admin/officers',
  'app/admin/analytics',
];

dirs.forEach(d => fs.mkdirSync(path.join(root, d), { recursive: true }));

const files = {
  // UI Components
  'components/ui/PageHeader.tsx': `export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 border-b-2 border-black/10 pb-4">
      <h1 className="text-3xl font-black uppercase tracking-tighter text-black">{title}</h1>
      {subtitle && <p className="mt-2 text-sm font-bold uppercase tracking-widest text-black/50">{subtitle}</p>}
    </div>
  );
}`,
  'components/ui/StatCard.tsx': `export default function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="flex flex-col border border-black/10 bg-white p-6 transition-colors hover:border-black">
      <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">{title}</span>
      <span className="mt-2 text-4xl font-black">{value}</span>
      {subtitle && <span className="mt-2 text-xs font-bold uppercase text-black/40">{subtitle}</span>}
    </div>
  );
}`,
  'components/ui/StatusBadge.tsx': `export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: 'border-yellow-500 text-yellow-600',
    Assigned: 'border-blue-500 text-blue-600',
    Resolved: 'border-green-500 text-green-600',
    P1: 'border-red-500 bg-red-50 text-red-600',
    P2: 'border-orange-500 text-orange-600',
    P3: 'border-yellow-500 text-yellow-600',
    P4: 'border-black/20 text-black/60',
  };
  const color = colors[status] || 'border-black/20 text-black/60';
  return (
    <span className={\`inline-block border px-2 py-1 text-[10px] font-bold uppercase tracking-widest \${color}\`}>
      {status}
    </span>
  );
}`,
  'components/ui/Timeline.tsx': `export default function Timeline({ events }: { events: { title: string; date: string; description?: string }[] }) {
  return (
    <div className="relative border-l-2 border-black/10 ml-3 space-y-8">
      {events.map((e, idx) => (
        <div key={idx} className="relative pl-6">
          <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-black bg-white" />
          <h4 className="text-sm font-bold uppercase tracking-widest">{e.title}</h4>
          <span className="text-[10px] font-bold uppercase text-black/40">{e.date}</span>
          {e.description && <p className="mt-2 text-sm font-medium text-black/70">{e.description}</p>}
        </div>
      ))}
    </div>
  );
}`,
  'components/ui/MapPlaceholder.tsx': `import { MapPin } from "lucide-react";
export default function MapPlaceholder({ title = "Active Zone Map", height = "h-64" }: { title?: string; height?: string }) {
  return (
    <div className={\`flex w-full items-center justify-center border border-black/10 bg-[#f8f8f8] \${height}\`}>
      <div className="text-center flex flex-col items-center">
        <MapPin className="h-8 w-8 text-black/20 mb-2" />
        <span className="text-xs font-bold uppercase tracking-widest text-black/40">{title}</span>
      </div>
    </div>
  );
}`,
  'components/ui/Card.tsx': `export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={\`border border-black/10 bg-white p-6 \${className}\`}>{children}</div>;
}`,
  'components/ui/Sidebar.tsx': `import Link from 'next/link';
export default function Sidebar({ links, title }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="w-64 border-r border-black/10 bg-[#fcfcfc] flex flex-col min-h-[calc(100vh-80px)]">
      <div className="p-6 border-b border-black/10">
        <h2 className="text-xs font-black uppercase tracking-widest text-black/60">{title}</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(l => (
          <Link key={l.href} href={l.href} className="block px-4 py-3 text-xs font-bold uppercase tracking-widest text-black/70 hover:bg-black hover:text-white transition-colors">
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}`,
  
  // Layouts
  'app/officer/layout.tsx': `import Sidebar from "@/components/ui/Sidebar";
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
}`,
  'app/admin/layout.tsx': `import Sidebar from "@/components/ui/Sidebar";
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
}`,
  'app/(citizen)/layout.tsx': `import Navbar from "@/components/Navbar";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex flex-1">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}`,

  // Citizen Pages
  'app/(citizen)/dashboard/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from 'next/link';

export default function Dashboard() {
  const complaints = [
    { id: 'C-001', subject: 'Pothole on Main St', status: 'Pending', date: 'Oct 12' },
    { id: 'C-002', subject: 'Streetlight out', status: 'Assigned', date: 'Oct 10' },
    { id: 'C-003', subject: 'Water leak', status: 'Resolved', date: 'Oct 05' },
  ];
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <PageHeader title="Welcome back, Citizen" subtitle="Your Civic Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Reports" value="12" />
        <StatCard title="Pending" value="2" />
        <StatCard title="Resolved" value="10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6 border-b border-black/10 pb-4">
            <h3 className="text-xl font-black uppercase">Recent Complaints</h3>
            <Link href="/portal/submit" className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black/80">
              Submit Complaint
            </Link>
          </div>
          <div className="space-y-4">
            {complaints.map(c => (
              <Link href={\`/portal/track/\${c.id}\`} key={c.id} className="block border border-black/10 p-4 hover:border-black transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-black/50 block mb-1">{c.id} • {c.date}</span>
                    <span className="text-sm font-bold uppercase">{c.subject}</span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-black uppercase mb-6 border-b border-black/10 pb-4">Notification Feed</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-black p-4 bg-gray-50">
              <span className="text-[10px] font-bold uppercase text-black/50">2 HOURS AGO</span>
              <p className="text-xs font-bold mt-1">C-002 has been assigned to Officer Delta.</p>
            </div>
            <div className="border-l-4 border-green-500 p-4 bg-gray-50">
              <span className="text-[10px] font-bold uppercase text-black/50">1 DAY AGO</span>
              <p className="text-xs font-bold mt-1">C-003 is resolved. Verification required.</p>
              <Link href="/portal/verify/C-003" className="text-[10px] uppercase font-bold underline mt-2 inline-block">Verify Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  'app/(citizen)/portal/submit/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import Card from "@/components/ui/Card";

export default function SubmitComplaint() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <PageHeader title="New Report" subtitle="AI will categorize and dispatch" />
      
      <div className="flex gap-4 mb-8">
        {['1. Details', '2. Location', '3. Uploads', '4. Review'].map((step, i) => (
          <div key={i} className={\`flex-1 text-[10px] font-bold uppercase tracking-widest border-b-2 pb-2 \${i === 0 ? 'border-black text-black' : 'border-black/10 text-black/40'}\`}>
            {step}
          </div>
        ))}
      </div>

      <Card className="mb-8">
        <label className="text-xs font-bold uppercase tracking-widest block mb-4">Describe the issue</label>
        <textarea className="w-full border p-4 text-sm outline-none focus:border-black h-32 bg-gray-50" placeholder="E.g. The streetlight is broken on main street..."></textarea>
      </Card>
      
      <Card className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs font-bold uppercase tracking-widest">Location Detected</label>
          <span className="bg-black text-white px-2 py-1 text-[10px] font-bold uppercase">Zone Alpha</span>
        </div>
        <MapPlaceholder height="h-48" />
      </Card>

      <div className="flex justify-end gap-4 mt-8">
        <button className="border border-black px-6 py-3 text-xs font-bold uppercase hover:bg-black/5">Cancel</button>
        <button className="bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-black/90">Proceed to Uploads</button>
      </div>
    </div>
  );
}`,

  'app/(citizen)/portal/track/[id]/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import Timeline from "@/components/ui/Timeline";
import StatusBadge from "@/components/ui/StatusBadge";
import Card from "@/components/ui/Card";
import MapPlaceholder from "@/components/ui/MapPlaceholder";

export default function Track({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex justify-between items-start">
        <PageHeader title={\`Track \${params.id}\`} subtitle="Pothole on Main St" />
        <StatusBadge status="Assigned" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-sm font-black uppercase mb-6">Resolution Timeline</h3>
          <Timeline events={[
            { title: 'Report Submitted', date: 'Oct 12, 09:00 AM', description: 'Citizen submitted report via web portal.' },
            { title: 'AI Prioritization', date: 'Oct 12, 09:05 AM', description: 'Flagged as P2 due to high traffic area.' },
            { title: 'Assigned to Officer', date: 'Oct 12, 10:30 AM', description: 'Assigned to Dept of Transport.' }
          ]} />
        </div>
        <div className="space-y-6">
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">Cluster Info</h4>
            <p className="text-sm mb-2"><span className="opacity-50">Related Reports:</span> 4 in area</p>
            <p className="text-sm"><span className="opacity-50">Estimated Fix:</span> Oct 15</p>
          </Card>
          <MapPlaceholder height="h-64" />
        </div>
      </div>
    </div>
  );
}`,

  'app/officer/tasks/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

export default function Tasks() {
  const tasks = [
    { id: 'T-992', title: 'Major Water Pipe Burst', priority: 'P1', sla: '2 hrs left', status: 'Pending' },
    { id: 'T-993', title: 'Traffic Light Outage', priority: 'P2', sla: '5 hrs left', status: 'Assigned' },
    { id: 'T-994', title: 'Graffiti Cleanup', priority: 'P4', sla: '3 days left', status: 'Pending' },
  ];
  return (
    <div>
      <PageHeader title="Active Tasks" subtitle="Dept of Public Works" />
      
      <div className="flex gap-4 mb-8">
        {['All', 'P1 Critical', 'Overdue'].map((t, i) => (
          <button key={i} className={\`px-4 py-2 text-xs font-bold uppercase border \${i === 0 ? 'bg-black text-white' : 'border-black/20 text-black/50 hover:border-black'}\`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {tasks.map(t => (
          <div key={t.id} className="border border-black/10 bg-white p-5 flex justify-between items-center hover:border-black transition-colors">
            <div className="flex gap-6 items-center">
              <StatusBadge status={t.priority} />
              <div>
                <span className="text-[10px] font-bold uppercase text-black/50">{t.id}</span>
                <h4 className="text-sm font-bold uppercase">{t.title}</h4>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">SLA Timer</span>
                <span className="text-xs font-bold text-red-600">{t.sla}</span>
              </div>
              <button className="border border-black px-4 py-2 text-[10px] font-bold uppercase hover:bg-black hover:text-white">Review</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,

  'app/admin/dashboard/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import MapPlaceholder from "@/components/ui/MapPlaceholder";

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Command Center" subtitle="City-wide Autonomous Swarm Overview" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Incidents" value="1,204" subtitle="+12% today" />
        <StatCard title="Auto-Resolved" value="84%" subtitle="By AI Agents" />
        <StatCard title="Avg Resolution" value="2.4h" subtitle="-1.1h from last week" />
        <StatCard title="Critical P1" value="7" subtitle="Requires immediate action" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-black uppercase mb-4 border-b border-black/10 pb-2">Predictive Heatmap</h3>
          <MapPlaceholder height="h-[400px]" title="P1 & P2 Incident Clusters" />
        </Card>

        <Card>
          <h3 className="text-sm font-black uppercase mb-4 border-b border-black/10 pb-2">Agent Action Feed</h3>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="border-l-2 border-black/20 pl-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Agent {Math.floor(Math.random()*100)} • JUST NOW</span>
                <p className="text-xs font-medium uppercase mt-1">Merged 3 redundant reports into Incident C-10{i}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, filepath), content);
}

console.log('UI files scaffolded securely.');
