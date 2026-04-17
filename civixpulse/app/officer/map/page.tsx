
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
}