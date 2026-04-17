export default function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="flex flex-col border border-black/10 bg-white p-6 transition-colors hover:border-black">
      <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">{title}</span>
      <span className="mt-2 text-4xl font-black">{value}</span>
      {subtitle && <span className="mt-2 text-xs font-bold uppercase text-black/40">{subtitle}</span>}
    </div>
  );
}