
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function Profile() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PageHeader title="Citizen Identity" subtitle="Manage your control node access" />
      
      <Card className="mb-8 p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full border-b border-black/20 p-2 text-sm font-bold uppercase outline-none focus:border-black bg-transparent" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">System ID (Email)</label>
              <input type="email" defaultValue="citizen@civix.gov" className="w-full border-b border-black/20 p-2 text-sm font-bold uppercase outline-none focus:border-black bg-transparent" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">Primary Zone</label>
            <input type="text" defaultValue="Zone Alpha, Hyderabad" className="w-full border-b border-black/20 p-2 text-sm font-bold uppercase outline-none focus:border-black bg-transparent" />
          </div>
          <button className="bg-black text-white px-6 py-3 text-xs font-bold uppercase">Update Identity</button>
        </div>
      </Card>
    </div>
  );
}