import PageHeader from "@/components/ui/PageHeader";
import Timeline from "@/components/ui/Timeline";
import StatusBadge from "@/components/ui/StatusBadge";
import Card from "@/components/ui/Card";
import dynamic from "next/dynamic";
import { createClient } from "@/libs/supabase/server";

const ComplaintMap = dynamic(() => import("@/components/ComplaintMap"), {
  ssr: false,
});

async function getTrackingData(complaintId: string) {
  const supabase = await createClient();
  
  // 1️⃣ Complaint Details
  const { data: complaint } = await supabase
    .from("complaints")
    .select("*")
    .eq("id", complaintId)
    .single();

  // 2️⃣ Officer Assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from("officer_assignments")
    .select("*")
    .eq("complaint_id", complaintId)
    .single();

  if (assignmentError) {
    console.error("Assignment error:", assignmentError);
  }

  // 3️⃣ Cluster (based on category)
  const { data: cluster } = await supabase
    .from("clusters")
    .select("*")
    .eq("category", assignment?.category || complaint?.category)
    .limit(1)
    .single();

  return {
    complaint,
    assignment,
    cluster,
  };
}

export default async function Track({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getTrackingData(id);

  if (!data?.complaint && !data?.assignment) {
    return (
      <div className="p-10 text-center text-red-500 font-bold uppercase">
        No tracking data found for ID: {id}
      </div>
    );
  }

  const { complaint, assignment, cluster } = data;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-start">
        <PageHeader
          title={`Track ${id.split('-')[0]}`}
          subtitle={complaint?.category || assignment?.category || "Complaint"}
        />
        <StatusBadge status={complaint?.status || assignment?.status || "Pending"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* TIMELINE */}
        <div>
          <h3 className="text-sm font-black uppercase mb-6">
            Resolution Timeline
          </h3>

          <Timeline
            events={[
              {
                title: "Complaint Submitted",
                date: complaint?.created_at ? new Date(complaint.created_at).toLocaleString() : "Auto",
                description: "Citizen reported issue via " + (complaint?.source || "portal"),
              },
              {
                title: "Cluster Identified",
                date: cluster?.created_at ? new Date(cluster.created_at).toLocaleString() : "Auto",
                description: cluster ? `${cluster.category} - ${cluster.root_cause}` : "Isolated incident",
              },
              {
                title: "Assigned to Officer",
                date: assignment?.assigned_at ? new Date(assignment.assigned_at).toLocaleString() : "Pending",
                description: assignment ? `Officer: ${assignment.officer_name}` : "Pending assignment",
              },
              {
                title: "Expected Resolution (SLA)",
                date: assignment?.sla_deadline_hours ? `${assignment.sla_deadline_hours} hrs` : "N/A",
                description: `Severity: ${assignment?.severity || complaint?.severity || "N/A"}`,
              },
            ]}
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="space-y-6">
          {/* Cluster Info */}
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">
              Cluster Info
            </h4>
            <p className="text-sm mb-2">
              <span className="opacity-50">Category:</span>{" "}
              {cluster?.category || complaint?.category || "N/A"}
            </p>
            <p className="text-sm mb-2">
              <span className="opacity-50">Root Cause:</span>{" "}
              {cluster?.root_cause || "Pending Analysis"}
            </p>
            <p className="text-sm">
              <span className="opacity-50">Confidence:</span>{" "}
              {cluster?.confidence || "N/A"}
            </p>
          </Card>

          {/* Officer Assignment */}
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">
              Officer Assignment
            </h4>
            <p className="text-sm mb-2">
              <span className="opacity-50">Officer:</span>{" "}
              {assignment?.officer_name || complaint?.officer_name || "Unassigned"}
            </p>
            <p className="text-sm mb-2">
              <span className="opacity-50">Department:</span>{" "}
              {assignment?.category || "N/A"}
            </p>
            <p className="text-sm mb-2">
              <span className="opacity-50">Severity:</span>{" "}
              {assignment?.severity || complaint?.severity || "N/A"}
            </p>
            <p className="text-sm mb-2">
              <span className="opacity-50">Assigned At:</span>{" "}
              {assignment?.assigned_at || "N/A"}
            </p>
            <p className="text-sm">
              <span className="opacity-50">SLA:</span>{" "}
              {assignment?.sla_deadline_hours ? `${assignment.sla_deadline_hours} hrs` : "N/A"}
            </p>
          </Card>

          {/* MAP */}
          {(complaint?.latitude && complaint?.longitude) && (
            <ComplaintMap
              lat={complaint.latitude}
              lng={complaint.longitude}
            />
          )}
        </div>
      </div>
    </div>
  );
}