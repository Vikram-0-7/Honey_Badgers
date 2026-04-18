"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/libs/supabase/client";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      alert("Failed to update password: " + error.message);
    } else {
      alert("Passkey updated successfully! You are now logged in.");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white text-black p-8">
      <div className="w-full max-w-md border border-black/10 p-8 shadow-sm">
        <h2 className="mb-2 text-3xl font-black uppercase tracking-tighter text-black">
          Update Passkey
        </h2>
        <p className="mb-8 text-sm font-bold uppercase tracking-widest text-black/50">
          Set your new credentials to proceed
        </p>

        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black">
              New Passkey
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
            className="mt-4 flex w-full justify-center border-2 border-black bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black disabled:opacity-50"
          >
            {loading ? "Updating..." : "Confirm Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
