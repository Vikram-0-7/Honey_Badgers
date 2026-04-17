export default function Timeline({ events }: { events: { title: string; date: string; description?: string }[] }) {
  return (
    <div className="relative border-l-2 border-black/10 ml-3 space-y-8">
      {events.map((e, idx) => (
        <div key={idx} className="relative pl-6">
          <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-black bg-white" />
          <h4 className="text-sm font-bold uppercase tracking-widest">{e.title}</h4>
          <span className="text-[10px] font-bold uppercase text-black/40">{e.date}</span>
          {e.description && <p className="mt-2 text-sm font-medium text-black/70">{e.description}</p>}
        </div>
      ))}
    </div>
  );
}