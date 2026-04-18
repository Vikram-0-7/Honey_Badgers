import PageHeader from "@/components/ui/PageHeader";
import Timeline from "@/components/ui/Timeline";
import StatusBadge from "@/components/ui/StatusBadge";
import Card from "@/components/ui/Card";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import { createClient } from "@/libs/supabase/server";

// ✅ Fetch data from Supabase
async function getTrackingData(complaintId: string) {
  const supabase = await createClient();
  // 1️⃣ Officer Assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from("officer_assignments")
    .select("*")
    .eq("complaint_id", complaintId)
    .single();

  if (assignmentError) {
    console.error("Assignment error:", assignmentError);
    return null;
  }

  // 2️⃣ Cluster (based on category)
  const { data: cluster } = await supabase
    .from("clusters")
    .select("*")
    .eq("category", assignment.category)
    .single();

  return {
    assignment,
    cluster,
  };
}

export default async function Track({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ FIX: unwrap params
  const { id } = await params;

  const data = await getTrackingData(id);

  if (!data) {
    return (
      <div className="p-10 text-center text-red-500">
        No tracking data found
      </div>
    );
  }

  const { assignment, cluster } = data;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">

      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <PageHeader
          title={`Track ${id}`}
          subtitle={assignment.category || "Complaint"}
        />
        <StatusBadge status={assignment.status || "Pending"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Timeline */}
        <div>
          <h3 className="text-sm font-black uppercase mb-6">
            Resolution Timeline
          </h3>

          <Timeline
            events={[
              {
                title: "Complaint Submitted",
                date: "Auto",
                description: "Citizen reported issue",
              },
              {
                title: "Cluster Identified",
                date: cluster?.created_at || "Auto",
                description: `${cluster?.category} - ${cluster?.root_cause}`,
              },
              {
                title: "Assigned to Officer",
                date: assignment.assigned_at,
                description: `Officer: ${assignment.officer_name}`,
              },
              {
                title: "Expected Resolution (SLA)",
                date: `${assignment.sla_deadline_hours} hrs`,
                description: `Severity: ${assignment.severity}`,
              },
            ]}
          />
        </div>

        {/* Right Side */}
        <div className="space-y-6">

          {/* Cluster Info */}
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">
              Cluster Info
            </h4>

            <p className="text-sm mb-2">
              <span className="opacity-50">Category:</span>{" "}
              {cluster?.category || "N/A"}
            </p>

            <p className="text-sm mb-2">
              <span className="opacity-50">Root Cause:</span>{" "}
              {cluster?.root_cause || "N/A"}
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
              {assignment.officer_name}
            </p>

            <p className="text-sm mb-2">
              <span className="opacity-50">Department:</span>{" "}
              {assignment.category}
            </p>

            <p className="text-sm mb-2">
              <span className="opacity-50">Severity:</span>{" "}
              {assignment.severity}
            </p>

            <p className="text-sm mb-2">
              <span className="opacity-50">Assigned At:</span>{" "}
              {assignment.assigned_at}
            </p>

            <p className="text-sm">
              <span className="opacity-50">SLA:</span>{" "}
              {assignment.sla_deadline_hours} hrs
            </p>
          </Card>

          <MapPlaceholder height="h-64" />
        </div>
      </div>
    </div>
  );
}