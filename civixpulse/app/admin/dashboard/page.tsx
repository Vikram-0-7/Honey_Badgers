
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
}