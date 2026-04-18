"use client";

import PageHeader from "@/components/ui/PageHeader";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import Card from "@/components/ui/Card";
import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";

export default function SubmitComplaint() {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "image" | "voice">("manual");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "analyzing" | "done">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async () => {
    const supabase = await createClient();

    if (!text) return alert("Enter complaint");

    setLoading(true);
    setStep("analyzing");

    setStatusMsg("Analyzing complaint...");
    await new Promise((r) => setTimeout(r, 1000));

    setStatusMsg("Detecting clusters...");
    await new Promise((r) => setTimeout(r, 1000));

    setStatusMsg("Generating insights...");
    await new Promise((r) => setTimeout(r, 1000));

    const res = await fetch("/api/launch-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        location: "Madhapur",
        source: "portal",
      }),
    });

    const data = await res.json();

    const analyzeData = data.data;
    // const pipelineData = data.pipelineData;

    console.log("API RESPONSE:", data);

    const runId = analyzeData.pipeline_run_id;

    // ✅ 1. Insert pipeline run
    await supabase.from("pipeline_runs").insert({
      id: runId,
      message: analyzeData.message,
      total_complaints: analyzeData.total_complaints,
      total_clusters: analyzeData.total_clusters,
      city_health_score: analyzeData.city_health.score,
      city_health_status: analyzeData.city_health.status,
      top_risk_area: analyzeData.top_risk_area.area,
      top_risk_reason: analyzeData.top_risk_area.reason,
      most_affected_category: analyzeData.most_affected_category.category,
    });

    // ✅ 2. Insert complaints
    for (const c of analyzeData.complaints) {
      await supabase.from("complaints").insert({
        id: c.id,
        text: c.text,
        latitude: c.latitude,
        longitude: c.longitude,
        source: c.source,
        category: c.category,
        severity: c.severity,
        priority_score: c.priority_score,
        officer_name: c.officer_name,
        sla_status: c.sla_status,
        status: c.status,
      });
    }

    // ✅ 3. Insert officer assignments
    for (const a of analyzeData.officer_assignments) {
      await supabase.from("officer_assignments").insert({
        complaint_id: a.complaint_id,
        pipeline_run_id: runId,
        officer_id: a.officer_id,
        officer_name: a.officer_name,
        category: a.category,
        severity: a.severity,
        sla_deadline_hours: a.sla_deadline_hours,
        assigned_at: a.assigned_at,
        status: a.status,
      });
    }

    // ✅ 4. Insert system summary
    await supabase.from("system_summary").insert({
      pipeline_run_id: runId,
      total_complaints: analyzeData.system_summary.total_complaints,
      critical_issues: analyzeData.system_summary.critical_issues,
      clusters: analyzeData.system_summary.clusters,
      top_risk_area: analyzeData.system_summary.top_risk_area,
      city_health_score: analyzeData.system_summary.city_health_score,
    });

    // ✅ 5. Insert logs
    for (const log of analyzeData.execution_log) {
      await supabase.from("execution_logs").insert({
        pipeline_run_id: runId,
        log,
      });
    }

    const complientId = analyzeData.complaints[0].id;

    setLoading(false);
    setStep("done");
    router.push(`/portal/track/${complientId}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <PageHeader title="New Report" subtitle="AI will categorize and dispatch" />

      <div className="flex gap-4 mb-8">
        {["1. Details", "2. Location", "3. Uploads", "4. Review"].map((stepName, i) => (
          <div
            key={i}
            className={`flex-1 text-[10px] font-bold uppercase tracking-widest border-b-2 pb-2 ${i === 0 ? "border-black text-black" : "border-black/10 text-black/40"
              }`}
          >
            {stepName}
          </div>
        ))}
      </div>

      {/* 🔥 LOADING STATE */}
      {step === "analyzing" && (
        <Card className="mb-8 text-center py-10">
          <p className="text-sm font-bold uppercase tracking-widest">
            {statusMsg}
          </p>
        </Card>
      )}

      {/* NORMAL UI */}
      {step !== "analyzing" && (
        <>
          <Card className="mb-8">
            <label className="text-xs font-bold uppercase tracking-widest block mb-4">
              Describe the issue
            </label>

            <div className="flex gap-2 mb-4">
              {["manual", "image", "voice"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m as any)}
                  className={`px-3 py-2 text-xs font-bold uppercase border ${mode === m
                    ? "bg-black text-white border-black"
                    : "border-black/20 text-black/60"
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border p-4 text-sm outline-none focus:border-black h-32 bg-gray-50"
              placeholder="E.g. The streetlight is broken..."
            />
          </Card>

          <Card className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold uppercase tracking-widest">
                Location Detected
              </label>
              <span className="bg-black text-white px-2 py-1 text-[10px] font-bold uppercase">
                Zone Alpha
              </span>
            </div>
            <MapPlaceholder height="h-48" />
          </Card>

          <div className="flex justify-end gap-4 mt-8">
            <button className="border border-black px-6 py-3 text-xs font-bold uppercase hover:bg-black/5">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-black/90"
            >
              Submit Complaint
            </button>
          </div>
        </>
      )}
    </div>
  );
}