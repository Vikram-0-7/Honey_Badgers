"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const [role, setRole] = useState("Citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = ["Citizen", "Officer", "Admin"];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // Optional: store role locally (since no backend)
    localStorage.setItem("role", role);

    // Redirect after login
    router.push("/");
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your System ID (Email) first to recover your credentials.");
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Password recovery link sent! Check your email inbox.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-2 text-3xl font-black uppercase tracking-tighter text-black">
        Access Node
      </h2>
      <p className="mb-8 text-sm font-bold uppercase tracking-widest text-black/50">
        Authenticate to proceed
      </p>

      <form className="flex flex-col gap-6" onSubmit={handleLogin}>
        {/* <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black">
            Role Identification
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 text-xs font-bold uppercase tracking-wider transition-colors border ${role === r
                    ? "border-black bg-black text-white"
                    : "border-black/20 bg-transparent text-black/60 hover:border-black/50"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div> */}

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black">
            System ID (Email)
          </label>
          <input
            type="email"
            placeholder="node.operator@civix.gov"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border-b-2 border-black/20 bg-transparent py-3 text-sm font-medium outline-none transition-colors focus:border-black placeholder:text-black/30"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-between border-2 border-black bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black disabled:opacity-50"
        >
          <span>
            {loading ? "Authenticating..." : "Initialize Authentication"}
          </span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={handleResetPassword}
          className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors"
        >
          Recover Credentials
        </button>
      </div>
    </div>
  );
}