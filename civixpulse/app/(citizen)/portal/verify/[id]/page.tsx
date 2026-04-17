
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function VerifyComplaint({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-center">
      <PageHeader title="Verification Required" subtitle={`Incident ${params.id}`} />
      
      <Card className="mb-8 text-left">
        <h4 className="text-sm font-black uppercase mb-4 border-b border-black/10 pb-2">Officer Notes</h4>
        <p className="text-sm">"The pothole on Main St has been filled and leveled with new asphalt. Work completed at 14:00 hours." - Officer Delta</p>
      </Card>

      <h3 className="text-xl font-black uppercase mb-8">Is the issue resolved to your satisfaction?</h3>
      <div className="flex gap-4 justify-center">
        <button className="flex-1 max-w-[200px] border-2 border-black bg-black text-white px-8 py-6 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
          Yes, Resolved
        </button>
        <button className="flex-1 max-w-[200px] border-2 border-black bg-transparent text-black px-8 py-6 text-sm font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">
          No, Reopen
        </button>
      </div>
      
      <div className="mt-12 opacity-50">
        <span className="text-[10px] font-bold uppercase tracking-widest block mb-2">Rate Service</span>
        <div className="flex justify-center gap-2 text-2xl">
          ★★★★★
        </div>
      </div>
    </div>
  );
}