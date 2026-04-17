"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";

export default function Dashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/complaints/user")
      .then((res) => res.json())
      .then((data) => setComplaints(data.complaints || []));
  }, []);

  // 🔥 Dynamic stats
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "pending").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <PageHeader title="Welcome back, Citizen" subtitle="Your Civic Dashboard" />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Reports" value={total} />
        <StatCard title="Pending" value={pending} />
        <StatCard title="Resolved" value={resolved} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* COMPLAINT LIST */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6 border-b border-black/10 pb-4">
            <h3 className="text-xl font-black uppercase">Recent Complaints</h3>

            <Link
              href="/portal/submit"
              className="bg-black text-white px-4 py-2 text-xs font-bold uppercase"
            >
              Submit Complaint
            </Link>
          </div>

          <div className="space-y-4">
            {complaints.map((c) => (
              <Link
                href={`/portal/track/${c.id}`}
                key={c.id}
                className="block border border-black/10 p-4 hover:border-black"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <span className="text-[10px] font-bold uppercase text-black/50 block mb-1">
                      {c.id} • {new Date(c.created_at).toDateString()}
                    </span>

                    <span className="text-sm font-bold uppercase">
                      {c.raw_text?.slice(0, 40)}
                    </span>
                  </div>

                  <StatusBadge status={c.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div>
          <h3 className="text-xl font-black uppercase mb-6 border-b border-black/10 pb-4">
            Notification Feed
          </h3>

          <div className="space-y-4">
            {complaints.slice(0, 3).map((c) => (
              <div key={c.id} className="border-l-4 border-black p-4 bg-gray-50">
                <span className="text-[10px] font-bold uppercase text-black/50">
                  {new Date(c.created_at).toLocaleString()}
                </span>

                <p className="text-xs font-bold mt-1">
                  Complaint {c.id} is {c.status}.
                </p>

                {c.status === "completed" && (
                  <Link
                    href={`/portal/verify/${c.id}`}
                    className="text-[10px] uppercase font-bold underline mt-2 inline-block"
                  >
                    Verify Now
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}