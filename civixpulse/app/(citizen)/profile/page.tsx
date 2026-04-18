"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [zone, setZone] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch profile
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setFullName(data.profile.full_name || "");
          setEmail(data.profile.email || "");
          setZone(data.profile.zone || "");
        }
      });
  }, []);

  async function updateProfile() {
    setLoading(true);

    await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email,
        zone,
      }),
    });

    setLoading(false);
    alert("Profile updated ✅");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PageHeader
        title="Citizen Identity"
        subtitle="Manage your control node access"
      />

      <Card className="mb-8 p-8">
        <div className="space-y-6">

          {/* NAME + EMAIL */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-b p-2 text-sm font-bold uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">
                System ID (Email)
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b p-2 text-sm font-bold uppercase"
              />
            </div>
          </div>

          {/* ZONE */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">
              Primary Zone
            </label>
            <input
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full border-b p-2 text-sm font-bold uppercase"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={updateProfile}
            disabled={loading}
            className="bg-black text-white px-6 py-3 text-xs font-bold uppercase"
          >
            {loading ? "Updating..." : "Update Identity"}
          </button>

        </div>
      </Card>
    </div>
  );
}