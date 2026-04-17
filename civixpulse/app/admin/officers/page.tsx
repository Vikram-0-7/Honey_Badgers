"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Tabs from "@/components/ui/Tabs";
import Card from "@/components/ui/Card";

export default function AdminOfficers() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddOfficer = async () => {
    if (!email) return alert("Enter email");

    setLoading(true);

    const res = await fetch("/api/create-officer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
    } else {
      alert("Officer invited successfully");
      setEmail("");
    }
  };

  return (
    <div>
      <PageHeader title="Operatives Grid" subtitle="Live tracking & assignment" />

      <Tabs tabs={["All Assigned", "Available", "On Leave"]} />

      {/* 🔥 ADD OFFICER (minimal, fits theme) */}
      <div className="flex gap-3 mb-6">
        <input
          type="email"
          placeholder="officer@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b-2 border-black/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-black"
        />
        <button
          onClick={handleAddOfficer}
          disabled={loading}
          className="px-4 py-2 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Officer"}
        </button>
      </div>

      {/* EXISTING GRID (UNCHANGED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-black">
                  O{i}
                </div>
                <span className="h-2 w-2 rounded-full bg-green-500 mt-2"></span>
              </div>
              <h4 className="text-lg font-black uppercase">Officer Alpha</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
                Dept of Transport
              </p>
            </div>
            <div className="mt-8 border-t border-black/10 pt-4 flex justify-between items-center">
              <span className="text-xs font-bold uppercase">3 Active</span>
              <button className="text-[10px] px-3 py-1 border border-black font-bold uppercase hover:bg-black hover:text-white">
                Reassign
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}