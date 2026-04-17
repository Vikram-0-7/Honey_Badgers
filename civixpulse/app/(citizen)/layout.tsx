import Navbar from "@/components/Navbar";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex flex-1">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}