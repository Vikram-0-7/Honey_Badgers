const fs = require('fs');
const path = require('path');

const root = __dirname;
const files = {
  // Missing Components
  'components/ui/Table.tsx': `export default function Table({ headers, rows }: { headers: string[], rows: (string|React.ReactNode)[][] }) {
  return (
    <div className="w-full overflow-x-auto border border-black/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 bg-gray-50 uppercase tracking-widest text-[10px] font-bold text-black/50">
          <tr>{headers.map((h, i) => <th key={i} className="px-6 py-4">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-black/5 hover:bg-gray-50/50 transition-colors">
              {row.map((cell, j) => <td key={j} className="px-6 py-4 font-medium">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
  'components/ui/Tabs.tsx': `export default function Tabs({ tabs }: { tabs: string[] }) {
  return (
    <div className="flex gap-4 border-b border-black/10 mb-8">
      {tabs.map((t, i) => (
        <button key={i} className={\`pb-2 text-xs font-bold uppercase tracking-widest border-b-2 \${i === 0 ? 'border-black text-black' : 'border-transparent text-black/50 hover:text-black hover:border-black/30'}\`}>
          {t}
        </button>
      ))}
    </div>
  );
}`,
  'components/ui/Modal.tsx': `export default function Modal({ isOpen, title, onClose, children }: { isOpen: boolean, title: string, onClose: () => void, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg border border-black p-6">
        <div className="flex justify-between items-center mb-6 border-b border-black/10 pb-4">
          <h3 className="text-xl font-black uppercase tracking-tighter">{title}</h3>
          <button onClick={onClose} className="text-black/50 hover:text-black">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}`,

  // Missing Pages
  'app/(citizen)/portal/verify/[id]/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function VerifyComplaint({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-center">
      <PageHeader title="Verification Required" subtitle={\`Incident \${params.id}\`} />
      
      <Card className="mb-8 text-left">
        <h4 className="text-sm font-black uppercase mb-4 border-b border-black/10 pb-2">Officer Notes</h4>
        <p className="text-sm">"The pothole on Main St has been filled and leveled with new asphalt. Work completed at 14:00 hours." - Officer Delta</p>
      </Card>

      <h3 className="text-xl font-black uppercase mb-8">Is the issue resolved to your satisfaction?</h3>
      <div className="flex gap-4 justify-center">
        <button className="flex-1 max-w-[200px] border-2 border-black bg-black text-white px-8 py-6 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
          Yes, Resolved
        </button>
        <button className="flex-1 max-w-[200px] border-2 border-black bg-transparent text-black px-8 py-6 text-sm font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">
          No, Reopen
        </button>
      </div>
      
      <div className="mt-12 opacity-50">
        <span className="text-[10px] font-bold uppercase tracking-widest block mb-2">Rate Service</span>
        <div className="flex justify-center gap-2 text-2xl">
          ★★★★★
        </div>
      </div>
    </div>
  );
}`,

  'app/(citizen)/profile/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function Profile() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PageHeader title="Citizen Identity" subtitle="Manage your control node access" />
      
      <Card className="mb-8 p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full border-b border-black/20 p-2 text-sm font-bold uppercase outline-none focus:border-black bg-transparent" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">System ID (Email)</label>
              <input type="email" defaultValue="citizen@civix.gov" className="w-full border-b border-black/20 p-2 text-sm font-bold uppercase outline-none focus:border-black bg-transparent" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">Primary Zone</label>
            <input type="text" defaultValue="Zone Alpha, Hyderabad" className="w-full border-b border-black/20 p-2 text-sm font-bold uppercase outline-none focus:border-black bg-transparent" />
          </div>
          <button className="bg-black text-white px-6 py-3 text-xs font-bold uppercase">Update Identity</button>
        </div>
      </Card>
    </div>
  );
}`,

  'app/officer/map/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";

export default function OfficerMap() {
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      <PageHeader title="Zone Map" subtitle="Real-time incident distribution" />
      
      <div className="flex gap-6 flex-1 h-full min-h-0">
        <Card className="w-80 flex-shrink-0 flex flex-col h-full overflow-hidden p-0">
          <div className="p-4 border-b border-black/10 bg-gray-50">
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Visible Incidents</h4>
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span><span className="text-[10px] font-bold uppercase">P1 (2)</span>
              <span className="h-3 w-3 rounded-full bg-orange-500 ml-2"></span><span className="text-[10px] font-bold uppercase">P2 (5)</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="border border-black/10 p-3 hover:border-black cursor-pointer">
                <StatusBadge status={i===1?"P1":"P2"} />
                <h5 className="text-xs font-bold uppercase mt-2">Issue T-10{i}</h5>
                <p className="text-[10px] uppercase text-black/50 mt-1">2.4km away</p>
              </div>
            ))}
          </div>
        </Card>
        
        <div className="flex-1 h-full">
          <MapPlaceholder height="h-full" title="Interactive Cluster Map" />
        </div>
      </div>
    </div>
  );
}`,

  'app/officer/tasks/[id]/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Card from "@/components/ui/Card";
import Timeline from "@/components/ui/Timeline";

export default function TaskDetail({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-start mb-8 border-b-2 border-black/10 pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black">Task {params.id}</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-black/50">Major Water Pipe Burst</p>
        </div>
        <StatusBadge status="P1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h3 className="text-sm font-black uppercase mb-4 border-b border-black/10 pb-2">Issue Description</h3>
            <p className="text-sm font-medium leading-relaxed">Massive water leakage reported near the central intersection. Flow is affecting traffic and causing minor flooding. Immediate shutoff requested.</p>
            <div className="mt-6 flex gap-4">
              <div className="w-32 h-32 bg-gray-200 border border-black/10 flex items-center justify-center text-[10px] font-bold uppercase text-black/30">IMG_01</div>
              <div className="w-32 h-32 bg-gray-200 border border-black/10 flex items-center justify-center text-[10px] font-bold uppercase text-black/30">IMG_02</div>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-sm font-black uppercase mb-4 border-b border-black/10 pb-2">Resolution Action</h3>
            <textarea className="w-full bg-gray-50 border border-black/10 p-4 min-h-[120px] text-sm focus:border-black outline-none mb-4" placeholder="Enter resolution notes..."></textarea>
            <div className="flex justify-between items-center">
              <select className="border border-black p-3 text-xs font-bold uppercase outline-none bg-white">
                <option>Mark as Resolved</option>
                <option>Require Assistance</option>
                <option>Escalate</option>
              </select>
              <button className="bg-black text-white px-8 py-3 text-xs font-bold uppercase">Submit Action</button>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="bg-black text-white border-0 mb-8">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">SLA Timer</h4>
            <p className="text-4xl font-black text-red-500">01:42:15</p>
          </Card>
          
          <h3 className="text-sm font-black uppercase mb-4">Event Log</h3>
          <Timeline events={[
            { title: 'Task Dispatched', date: 'TODAY, 14:00' },
            { title: 'Officer Acknowledged', date: 'TODAY, 14:05' }
          ]} />
        </div>
      </div>
    </div>
  );
}`,

  'app/officer/leaderboard/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Card from "@/components/ui/Card";

export default function Leaderboard() {
  const data = [
    ['01', 'Officer Delta', '142', '4.9/5.0', 'Dept of Transport'],
    ['02', 'Officer Bravo', '138', '4.8/5.0', 'Public Works'],
    ['03', 'Officer Echo', '125', '4.9/5.0', 'Sanitation'],
  ];
  return (
    <div>
      <PageHeader title="Performance Leaderboard" subtitle="Swarm Efficacy Rankings" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-black text-white border-0">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Your Current Rank</h4>
          <p className="text-6xl font-black mb-4">#01</p>
          <span className="inline-block bg-white text-black px-3 py-1 text-[10px] font-bold uppercase">Top 1% Resolver</span>
        </Card>
        <Card>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2">Weekly Goal</h4>
          <div className="h-12 w-full bg-gray-100 flex items-center px-4 relative mt-4">
            <div className="absolute top-0 left-0 h-full bg-black w-[85%]"></div>
            <span className="relative z-10 text-white font-black mix-blend-difference">34 / 40 RESOLVED</span>
          </div>
        </Card>
      </div>

      <h3 className="text-xl font-black uppercase mb-6">Top Operatives</h3>
      <Table 
        headers={['Rank', 'Identity', 'Tasks Resolved', 'Rating', 'Department']}
        rows={data}
      />
    </div>
  );
}`,

  'app/admin/clusters/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import MapPlaceholder from "@/components/ui/MapPlaceholder";

export default function AdminClusters() {
  return (
    <div>
      <PageHeader title="Incident Clusters" subtitle="AI grouping of related systemic issues" />
      
      <div className="space-y-6">
        {[1, 2].map(i => (
          <Card key={i} className={i===1 ? "border-l-4 border-l-red-500" : ""}>
            <div className="flex justify-between items-start mb-6 border-b border-black/10 pb-4">
              <div>
                <h3 className="text-xl font-black uppercase">Cluster #{9000 + i}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 mt-1">12 related reports spanning 3 days</p>
              </div>
              <StatusBadge status={i===1 ? "P1" : "P2"} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">AI Root Cause Analysis</h4>
                <p className="text-sm font-medium mb-6">Deteriorating underground pipe leading to repeated sinkholes and water leaks. Temporary fixes are failing. Deep excavation required.</p>
                <button className="bg-black text-white px-6 py-3 text-xs font-bold uppercase w-full">Dispatch specialized team</button>
              </div>
              <MapPlaceholder height="h-32" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}`,

  'app/admin/officers/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import Tabs from "@/components/ui/Tabs";
import Card from "@/components/ui/Card";

export default function AdminOfficers() {
  return (
    <div>
      <PageHeader title="Operatives Grid" subtitle="Live tracking & assignment" />
      
      <Tabs tabs={['All Assigned', 'Available', 'On Leave']} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <Card key={i} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-black">O{i}</div>
                <span className="h-2 w-2 rounded-full bg-green-500 mt-2"></span>
              </div>
              <h4 className="text-lg font-black uppercase">Officer Alpha</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">Dept of Transport</p>
            </div>
            <div className="mt-8 border-t border-black/10 pt-4 flex justify-between items-center">
              <span className="text-xs font-bold uppercase">3 Active</span>
              <button className="text-[10px] px-3 py-1 border border-black font-bold uppercase hover:bg-black hover:text-white">Reassign</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}`,

  'app/admin/analytics/page.tsx': `
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";

export default function AdminAnalytics() {
  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b-2 border-black/10 pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black">System Analytics</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-black/50">Swarm Efficacy Metrics</p>
        </div>
        <select className="border border-black p-3 text-xs font-bold uppercase bg-transparent outline-none">
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <Card className="lg:col-span-2 min-h-[300px] flex items-center justify-center bg-gray-50/50">
           <span className="text-sm font-bold uppercase text-black/30">[ Trend Line Chart Placeholder ]</span>
         </Card>
         <div className="space-y-6">
           <StatCard title="Citizen Satisfaction" value="4.8/5" />
           <StatCard title="Total Escalations" value="23" subtitle="Decreased by 42%" />
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="min-h-[250px] flex flex-col justify-center items-center bg-gray-50/50">
           <h3 className="text-xs font-black uppercase absolute top-6 left-6">Issues by Category</h3>
           <span className="text-sm font-bold uppercase text-black/30 mt-8">[ Donut Chart ]</span>
         </Card>
         <Card className="min-h-[250px] flex flex-col justify-center items-center bg-gray-50/50">
           <h3 className="text-xs font-black uppercase absolute top-6 left-6">Resolution Time Distribution</h3>
           <span className="text-sm font-bold uppercase text-black/30 mt-8">[ Bar Chart ]</span>
         </Card>
      </div>
    </div>
  );
}`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, filepath), content);
}

console.log('Part 2 UI files scaffolded securely.');
