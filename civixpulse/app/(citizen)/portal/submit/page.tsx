
import PageHeader from "@/components/ui/PageHeader";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import Card from "@/components/ui/Card";

export default function SubmitComplaint() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <PageHeader title="New Report" subtitle="AI will categorize and dispatch" />

      <div className="flex gap-4 mb-8">
        {['1. Details', '2. Location', '3. Uploads', '4. Review'].map((step, i) => (
          <div key={i} className={`flex-1 text-[10px] font-bold uppercase tracking-widest border-b-2 pb-2 ${i === 0 ? 'border-black text-black' : 'border-black/10 text-black/40'}`}>
            {step}
          </div>
        ))}
      </div>

      <Card className="mb-8">
        <label className="text-xs font-bold uppercase tracking-widest block mb-4">Describe the issue</label>
        <textarea className="w-full border p-4 text-sm outline-none focus:border-black h-32 bg-gray-50" placeholder="E.g. The streetlight is broken on main street..."></textarea>
      </Card>

      <Card className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs font-bold uppercase tracking-widest">Location Detected</label>
          <span className="bg-black text-white px-2 py-1 text-[10px] font-bold uppercase">Zone Alpha</span>
        </div>
        <MapPlaceholder height="h-48" />
      </Card>

      <div className="flex justify-end gap-4 mt-8">
        <button className="border border-black px-6 py-3 text-xs font-bold uppercase hover:bg-black/5">Cancel</button>
        <button className="bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-black/90">Proceed to Uploads</button>
      </div>
    </div>
  );
}