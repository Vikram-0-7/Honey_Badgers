
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
}