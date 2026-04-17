
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
}