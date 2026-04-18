import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/libs/supabase/server";

export default async function Hero() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <section className="relative overflow-hidden w-full border-b border-black/10 bg-white pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="flex flex-col items-start gap-8 z-10">
          <div className="inline-block border border-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black">
            Agentic Governance System
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-black">
            Precision In <br />
            Every Complaint <br />
            Resolution.
          </h1>
          <p className="max-w-md text-lg font-medium leading-relaxed text-black/60">
            AI agents autonomously detect, prioritize, and resolve civic issues in real time. The ultimate governance and grievance resolution swarm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="flex items-center justify-center gap-3 bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-black/80"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#services"
              className="flex items-center justify-center gap-3 border border-black bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-black hover:text-white"
            >
              View System
            </Link>
          </div>
        </div>

        {/* Right Illustration/Abstract */}
        <div className="relative h-[400px] w-full bg-brand-gray-light lg:h-[600px] overflow-hidden flex items-center justify-center group">
          {/* Abstract Geometric AI Visualization */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10 flex h-64 w-64 items-center justify-center rounded-none border-[12px] border-black bg-white transition-transform duration-700 ease-in-out group-hover:rotate-12 group-hover:scale-105">
            <div className="absolute top-4 left-4 h-4 w-4 bg-black"></div>
            <div className="absolute bottom-4 right-4 h-4 w-4 bg-black"></div>
            <div className="h-32 w-32 border-[8px] border-black/20 rounded-full animate-pulse"></div>
          </div>

          {/* Decorative elements representing nodes/agents */}
          <div className="absolute top-1/4 right-1/4 h-8 w-8 bg-black/10"></div>
          <div className="absolute bottom-1/3 left-1/4 h-12 w-12 border-4 border-black/10"></div>
          <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-black/10 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 h-full w-[1px] bg-black/10 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </section>
  );
}
