
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
}