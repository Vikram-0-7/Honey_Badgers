"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import Timeline from "@/components/ui/Timeline";
import StatusBadge from "@/components/ui/StatusBadge";
import Card from "@/components/ui/Card";
import MapPlaceholder from "@/components/ui/MapPlaceholder";

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

  // 🔥 Dynamic timeline (basic version)
  const timelineEvents = [
    {
      title: "Report Submitted",
      date: new Date(complaint.created_at).toLocaleString(),
      description: "Citizen submitted report via portal.",
    },
    {
      title: "AI Processing",
      date: new Date(complaint.created_at).toLocaleString(),
      description: `Categorized as ${complaint.category}`,
    },
    {
      title: "Status Update",
      date: new Date().toLocaleString(),
      description: `Current status: ${complaint.status}`,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-start">
        <PageHeader
          title={`Track ${complaint.id}`}
          subtitle={complaint.raw_text?.slice(0, 50)}
        />

        <StatusBadge status={complaint.status} />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* TIMELINE */}
        <div>
          <h3 className="text-sm font-black uppercase mb-6">
            Resolution Timeline
          </h3>

          <Timeline events={timelineEvents} />
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* CLUSTER INFO (placeholder for now) */}
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">
              Cluster Info
            </h4>

            <p className="text-sm mb-2">
              <span className="opacity-50">Related Reports:</span> Coming soon
            </p>

            <p className="text-sm">
              <span className="opacity-50">Priority:</span> {complaint.priority}
            </p>
          </Card>

          {/* MAP (upgrade later to real map) */}
          <MapPlaceholder height="h-64" />

          {/* OPTIONAL: SHOW COORDINATES */}
          {complaint.latitude && (
            <p className="text-xs font-bold">
              {complaint.latitude}, {complaint.longitude}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}