
import PageHeader from "@/components/ui/PageHeader";
import Timeline from "@/components/ui/Timeline";
import StatusBadge from "@/components/ui/StatusBadge";
import Card from "@/components/ui/Card";
import MapPlaceholder from "@/components/ui/MapPlaceholder";

export default function Track({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex justify-between items-start">
        <PageHeader title={`Track ${params.id}`} subtitle="Pothole on Main St" />
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
}