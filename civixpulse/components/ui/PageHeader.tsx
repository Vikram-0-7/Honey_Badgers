export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 border-b-2 border-black/10 pb-4">
      <h1 className="text-3xl font-black uppercase tracking-tighter text-black">{title}</h1>
      {subtitle && <p className="mt-2 text-sm font-bold uppercase tracking-widest text-black/50">{subtitle}</p>}
    </div>
  );
}