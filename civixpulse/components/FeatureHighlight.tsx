import Link from "next/link";

export default function FeatureHighlight() {
  return (
    <section className="w-full bg-black py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-12 text-center flex flex-col items-center">
        <h2 className="mb-6 text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
          Enter the Autonomous Governance Layer
        </h2>
        <p className="mb-12 text-lg font-medium tracking-widest uppercase text-white/50">
          Limited pilot deployments for smart cities.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center bg-white px-10 py-5 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-white/80"
        >
          Request Access
        </Link>
      </div>
    </section>
  );
}
