export default function Tabs({ tabs }: { tabs: string[] }) {
  return (
    <div className="flex gap-4 border-b border-black/10 mb-8">
      {tabs.map((t, i) => (
        <button key={i} className={`pb-2 text-xs font-bold uppercase tracking-widest border-b-2 ${i === 0 ? 'border-black text-black' : 'border-transparent text-black/50 hover:text-black hover:border-black/30'}`}>
          {t}
        </button>
      ))}
    </div>
  );
}