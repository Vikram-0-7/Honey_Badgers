"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function VerifyComplaint() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch complaint
  useEffect(() => {
    fetch(`/api/complaints/${id}`)
      .then((res) => res.json())
      .then((data) => setComplaint(data.complaint));
  }, [id]);

  async function updateStatus(status: string) {
    setLoading(true);

    await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        rating,
      }),
    });

    setLoading(false);
    alert("Response recorded ✅");
  }

  if (!complaint) return <div className="p-10">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-center">

      <PageHeader
        title="Verification Required"
        subtitle={`Incident ${complaint.id}`}
      />

      {/* OFFICER NOTES */}
      <Card className="mb-8 text-left">
        <h4 className="text-sm font-black uppercase mb-4 border-b border-black/10 pb-2">
          Officer Notes
        </h4>

        <p className="text-sm">
          {complaint.officer_notes || "Work completed. Awaiting verification."}
        </p>
      </Card>

      {/* ACTION */}
      <h3 className="text-xl font-black uppercase mb-8">
        Is the issue resolved?
      </h3>

      <div className="flex gap-4 justify-center">
        <button
          disabled={loading}
          onClick={() => updateStatus("resolved")}
          className="flex-1 max-w-[200px] border-2 border-black bg-black text-white px-8 py-6 text-sm font-bold uppercase hover:bg-white hover:text-black"
        >
          Yes, Resolved
        </button>

        <button
          disabled={loading}
          onClick={() => updateStatus("reopened")}
          className="flex-1 max-w-[200px] border-2 border-black px-8 py-6 text-sm font-bold uppercase hover:bg-black/5"
        >
          No, Reopen
        </button>
      </div>

      {/* RATING */}
      <div className="mt-12 opacity-70">
        <span className="text-[10px] font-bold uppercase tracking-widest block mb-2">
          Rate Service
        </span>

        <div className="flex justify-center gap-2 text-2xl cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? "text-black" : "text-gray-300"}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}