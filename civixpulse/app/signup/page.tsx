// app/signup/page.tsx
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen w-full bg-white text-black selection:bg-black selection:text-white flex-col lg:flex-row">
            {/* SAME LEFT PANEL */}
            <div className="relative flex w-full flex-col justify-between bg-black p-8 text-white lg:w-5/12 lg:p-16">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-start">
                    <Link
                        href="/"
                        className="mb-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" /> Return to Terminal
                    </Link>

                    <Link href="/" className="mb-4 inline-block text-3xl font-black uppercase tracking-tighter">
                        Civix<span className="text-white/50">-</span>Pulse
                    </Link>

                    <div className="inline-block border border-white/20 px-3 py-1 mb-16 text-[10px] font-bold uppercase tracking-widest text-white">
                        Secure Gateway
                    </div>
                </div>

                <div className="relative z-10">
                    <h1 className="mb-6 text-4xl md:text-5xl font-black uppercase leading-[1.1] tracking-tighter text-white">
                        Join the Control Network.
                    </h1>
                    <p className="max-w-sm text-sm font-medium tracking-widest text-white/60 uppercase leading-relaxed">
                        Register securely to access the autonomous civic resolution system.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex w-full flex-1 items-center justify-center p-8 lg:p-16">
                <SignupForm />
            </div>
        </div>
    );
}