
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
              <Link href={`/portal/track/${c.id}`} key={c.id} className="block border border-black/10 p-4 hover:border-black transition-colors">
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
}