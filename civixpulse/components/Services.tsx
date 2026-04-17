import { 
  Eye, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  Network
} from "lucide-react";

const services = [
  {
    icon: Eye,
    title: "Multimodal Ingestion",
    description: "Process text, voice, and image reports seamlessly."
  },
  {
    icon: BrainCircuit,
    title: "Priority Intelligence",
    description: "Rank issues instantly by collective impact."
  },
  {
    icon: ShieldCheck,
    title: "Systemic Auditor",
    description: "Identify recurring infrastructural failures."
  },
  {
    icon: Zap,
    title: "Autonomous Dispatch",
    description: "Route verified tasks to exact departments."
  },
  {
    icon: MessageSquare,
    title: "Citizen Feedback Loop",
    description: "Real-time updates directly to reporters."
  },
  {
    icon: Network,
    title: "Cross-Department Sync",
    description: "Eliminate silos across civic bodies."
  }
];

export default function Services() {
  return (
    <section id="services" className="w-full bg-brand-gray-light py-32 border-b border-black/10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
            The Swarm Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black/10 bg-white">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div 
                key={idx} 
                className="group relative flex flex-col items-center justify-center border border-black/10 p-12 text-center transition-colors hover:bg-black hover:text-white"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center bg-black/5 transition-colors group-hover:bg-white/10">
                  <Icon className="h-8 w-8 text-black group-hover:text-white transition-colors" />
                </div>
                <h3 className="mb-3 text-lg font-bold uppercase tracking-wider">
                  {service.title}
                </h3>
                <p className="text-sm font-medium text-black/60 group-hover:text-white/70">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
