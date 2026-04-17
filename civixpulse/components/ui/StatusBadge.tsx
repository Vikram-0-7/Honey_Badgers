export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: 'border-yellow-500 text-yellow-600',
    Assigned: 'border-blue-500 text-blue-600',
    Resolved: 'border-green-500 text-green-600',
    P1: 'border-red-500 bg-red-50 text-red-600',
    P2: 'border-orange-500 text-orange-600',
    P3: 'border-yellow-500 text-yellow-600',
    P4: 'border-black/20 text-black/60',
  };
  const color = colors[status] || 'border-black/20 text-black/60';
  return (
    <span className={`inline-block border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${color}`}>
      {status}
    </span>
  );
}