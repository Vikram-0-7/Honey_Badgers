"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Card from "@/components/ui/Card";
import Timeline from "@/components/ui/Timeline";

const ComplaintMap = dynamic(() => import("@/components/ComplaintMap"), {
  ssr: false,
});

export default function Track() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/complaints/${id}`);
      const data = await res.json();
      setComplaint(data.complaint);
    }

    if (id) fetchData();
  }, [id]);

  if (!complaint) {
    return (
      <div className="p-10 text-center font-bold uppercase">
        Loading...
      </div>
    );
  }

  // 🔥 Timeline (important for your system vision)
  const timelineEvents = [
    {
      title: "Report Submitted",
      date: new Date(complaint.created_at).toLocaleString(),
      description: "Citizen submitted complaint via portal",
    },
    {
      title: "System Logged",
      date: new Date(complaint.created_at).toLocaleString(),
      description: `Source: ${complaint.source}`,
    },
    {
      title: "Current Status",
      date: new Date().toLocaleString(),
      description: complaint.status,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-start">
        <PageHeader
          title={`Track ${complaint.id}`}
          subtitle={complaint.text}
        />
        <StatusBadge status={complaint.status} />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT → TIMELINE */}
        <div>
          <h3 className="text-sm font-black uppercase mb-6">
            Resolution Timeline
          </h3>

          <Timeline events={timelineEvents} />
        </div>

        {/* RIGHT → DETAILS */}
        <div className="space-y-6">

          {/* DETAILS CARD */}
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-b pb-2">
              Complaint Info
            </h4>

            <p className="text-sm mb-2">
              <span className="opacity-50">Category:</span> {complaint.category || "General"}
            </p>

            <p className="text-sm mb-2">
              <span className="opacity-50">Severity:</span> {complaint.severity || "Medium"}
            </p>

            <p className="text-sm mb-2">
              <span className="opacity-50">Priority Score:</span> {complaint.priority_score ?? "N/A"}
            </p>

            <p className="text-sm">
              <span className="opacity-50">Source:</span> {complaint.source}
            </p>
          </Card>

          {/* OFFICER / SLA */}
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-b pb-2">
              Assignment
            </h4>

            <p className="text-sm mb-2">
              <span className="opacity-50">Officer:</span>{" "}
              {complaint.officer_name || "Not assigned"}
            </p>

            <p className="text-sm">
              <span className="opacity-50">SLA Status:</span>{" "}
              {complaint.sla_status || "Pending"}
            </p>
          </Card>

          {/* MAP */}
          <ComplaintMap
            lat={complaint.latitude}
            lng={complaint.longitude}
          />

          {/* COORDS */}
          {complaint.latitude && (
            <p className="text-xs font-bold">
              {complaint.latitude.toFixed(4)},{" "}
              {complaint.longitude?.toFixed(4)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}