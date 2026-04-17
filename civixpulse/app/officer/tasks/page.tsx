
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
          <button key={i} className={`px-4 py-2 text-xs font-bold uppercase border ${i === 0 ? 'bg-black text-white' : 'border-black/20 text-black/50 hover:border-black'}`}>
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
}