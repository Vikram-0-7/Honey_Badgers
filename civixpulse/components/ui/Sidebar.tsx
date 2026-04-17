import Link from 'next/link';
export default function Sidebar({ links, title }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="w-64 border-r border-black/10 bg-[#fcfcfc] flex flex-col min-h-[calc(100vh-80px)]">
      <div className="p-6 border-b border-black/10">
        <h2 className="text-xs font-black uppercase tracking-widest text-black/60">{title}</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(l => (
          <Link key={l.href} href={l.href} className="block px-4 py-3 text-xs font-bold uppercase tracking-widest text-black/70 hover:bg-black hover:text-white transition-colors">
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}