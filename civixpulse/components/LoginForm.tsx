"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function LoginForm() {
  const [role, setRole] = useState("Citizen");

  const roles = ["Citizen", "Officer", "Admin"];

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-2 text-3xl font-black uppercase tracking-tighter text-black">
        Access Node
      </h2>
      <p className="mb-8 text-sm font-bold uppercase tracking-widest text-black/50">
        Authenticate to proceed
      </p>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black">
            Role Identification
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 text-xs font-bold uppercase tracking-wider transition-colors border ${
                  role === r
                    ? "border-black bg-black text-white"
                    : "border-black/20 bg-transparent text-black/60 hover:border-black/50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black">
            System ID (Email)
          </label>
          <input
            type="email"
            placeholder="node.operator@civix.gov"
            className="w-full border-b-2 border-black/20 bg-transparent py-3 text-sm font-medium outline-none transition-colors focus:border-black placeholder:text-black/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black">
            Passkey
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border-b-2 border-black/20 bg-transparent py-3 text-sm font-medium outline-none transition-colors focus:border-black placeholder:text-black/30"
          />
        </div>

        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-between border-2 border-black bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
        >
          <span>Initialize Authentication</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <a href="#" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors">
          Recover Credentials
        </a>
      </div>
    </div>
  );
}
