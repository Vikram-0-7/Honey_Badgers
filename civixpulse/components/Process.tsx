export default function Process() {
  const steps = [
    {
      num: "01",
      title: "Report / Detect",
      description: "Citizens or AI detect issues via multiple channels."
    },
    {
      num: "02",
      title: "Analyze & Prioritize",
      description: "AI agents rank impact and identify root cause."
    },
    {
      num: "03",
      title: "Resolve & Verify",
      description: "Tasks assigned, completed, and verified automatically."
    }
  ];

  return (
    <section className="w-full bg-white py-32 border-b border-black/10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-24 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
            The Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-black/20 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border-2 border-black bg-white transition-transform duration-500 group-hover:scale-110">
                <span className="text-2xl font-black">{step.num}</span>
              </div>
              <h3 className="mb-4 text-xl font-bold uppercase tracking-wider text-black">
                {step.title}
              </h3>
              <p className="max-w-[280px] text-sm font-medium text-black/60 leading-relaxed uppercase tracking-wider">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
