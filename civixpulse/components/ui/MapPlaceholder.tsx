import { MapPin } from "lucide-react";
export default function MapPlaceholder({ title = "Active Zone Map", height = "h-64" }: { title?: string; height?: string }) {
  return (
    <div className={`flex w-full items-center justify-center border border-black/10 bg-[#f8f8f8] ${height}`}>
      <div className="text-center flex flex-col items-center">
        <MapPin className="h-8 w-8 text-black/20 mb-2" />
        <span className="text-xs font-bold uppercase tracking-widest text-black/40">{title}</span>
      </div>
    </div>
  );
}