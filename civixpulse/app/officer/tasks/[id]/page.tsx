
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
}