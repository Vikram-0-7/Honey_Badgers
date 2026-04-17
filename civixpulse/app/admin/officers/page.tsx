
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
}