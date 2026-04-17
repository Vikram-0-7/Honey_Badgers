import Link from "next/link";
import { Monitor, Smartphone } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Architecture", "Docs"]
    },
    {
      title: "Platform",
      links: ["Agents", "Integrations", "API"]
    },
    {
      title: "Connect",
      links: ["Contact", "Support"]
    }
  ];

  return (
    <footer className="w-full bg-white border-t border-black/10 text-black py-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-8">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block text-2xl font-black uppercase tracking-tighter mb-6">
                Civix<span className="text-black/50">-</span>Pulse
              </Link>
              <p className="max-w-xs text-xs font-bold uppercase tracking-widest text-black/50 leading-loose">
                Autonomous AI agents for systemic issue resolution. Control nodes active.
              </p>
            </div>
            
            <div className="mt-16 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white text-lg font-bold">
              C
            </div>
          </div>

          {/* Links Cols */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="flex flex-col">
              <h4 className="mb-8 text-sm font-black uppercase tracking-widest">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href="#" 
                      className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Terminal / App Mock Col */}
          <div className="flex flex-col">
            <h4 className="mb-8 text-sm font-black uppercase tracking-widest">
              Terminal
            </h4>
            <div className="flex flex-col gap-4">
              <button className="flex w-full items-center justify-between gap-3 bg-black px-5 py-4 text-xs font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-80">
                <span>Web Terminal</span>
                <Monitor className="h-4 w-4" />
              </button>
              <button className="flex w-full items-center justify-between gap-3 bg-black px-5 py-4 text-xs font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-80">
                <span>Mobile Dispatch</span>
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        <div className="mt-24 w-full flex flex-col sm:flex-row items-center justify-between border-t border-black/10 pt-8 text-[10px] font-bold uppercase tracking-widest text-black/40">
          <p>© {new Date().getFullYear()} Civix-Pulse Protocol. All rights secured.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-black">Privacy Policy</Link>
            <Link href="#" className="hover:text-black">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
