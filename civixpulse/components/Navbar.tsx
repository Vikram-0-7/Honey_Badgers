import Link from "next/link";
import { Search, MapPin, User, LogIn } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.1] bg-white text-black">
      <div className="flex h-20 items-center justify-between px-6 md:px-12">
        {/* LOGO */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
            Civix<span className="text-black/50">-</span>Pulse
          </Link>
        </div>

        {/* CENTER CONTROL NODE */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-xl px-12">
          {/* Location / Search Group */}
          <div className="flex w-full overflow-hidden border border-black/10 transition-colors focus-within:border-black">
            <div className="flex items-center gap-2 border-r border-black/10 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-black/70">
              <MapPin className="h-4 w-4" />
              <span>Hyderabad Control Node</span>
            </div>
            <div className="flex flex-1 items-center px-4">
              <Search className="h-4 w-4 text-black/40" />
              <input 
                type="text" 
                placeholder="Search grievances, zones..." 
                className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-black/40"
              />
            </div>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-6">
          <Link 
            href="/login" 
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-70"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline-block">Officer / Citizen</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
