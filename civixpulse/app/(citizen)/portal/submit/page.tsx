"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import { createClient } from "@/libs/supabase/client";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
});

export default function SubmitComplaint() {
  const router = useRouter();

  const [mode, setMode] = useState<"form" | "image" | "audio">("form");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "analyzing" | "done">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async () => {
    const supabase = await createClient();

    if (mode === "form" && !description) return alert("Enter complaint");
    if (mode !== "form" && !file) return alert("Upload file");
    if (!lat || !lng) return alert("Select location");

    setLoading(true);
    setStep("analyzing");

    try {
      setStatusMsg("Uploading & extracting text...");
      let finalDescription = description;

      // 1️⃣ Extract text if file
      if (mode !== "form" && file) {
        const formData = new FormData();
        formData.append("mode", mode);
        formData.append("latitude", String(lat));
        formData.append("longitude", String(lng));
        formData.append("file", file);

        const res = await fetch("/api/complaints", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error("Upload failed");
        
        finalDescription = data.complaint.text;
        // The old route already saved the complaint, but we'll let the new flow run anyway.
        // We can just use the returned text.
      }

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
          text: finalDescription,
          location: `${lat},${lng}`,
          latitude: lat,
          longitude: lng,
          source: mode,
        }),
      });

      const data = await res.json();
      const analyzeData = data.data;

      console.log("API RESPONSE:", data);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!analyzeData?.pipeline_run_id) {
         throw new Error("Agent analysis failed");
      }

      const runId = analyzeData.pipeline_run_id;
      // The newly created complaint is typically the last one added to the mock data
      const newComplaintId = analyzeData.complaints[analyzeData.complaints.length - 1].id;

      // ✅ 1. Insert pipeline run
      await supabase.from("pipeline_runs").insert({
        id: runId,
        message: analyzeData.message,
        total_complaints: analyzeData.total_complaints,
        total_clusters: analyzeData.total_clusters,
        city_health_score: analyzeData.city_health?.score || 0,
        city_health_status: analyzeData.city_health?.status || "Unknown",
        top_risk_area: analyzeData.top_risk_area?.area || "Unknown",
        top_risk_reason: analyzeData.top_risk_area?.reason || "Unknown",
        most_affected_category: analyzeData.most_affected_category?.category || "Unknown",
      });

      // ✅ 2. Insert complaints
      for (const c of analyzeData.complaints) {
        // Upsert to handle the one we might have already inserted via /api/complaints
        const complaintData: any = {
          id: c.id,
          text: c.text,
          latitude: c.latitude,
          longitude: c.longitude,
          source: c.source || "portal",
          category: c.category,
          severity: c.severity,
          priority_score: c.priority_score,
          officer_name: c.officer_name,
          sla_status: c.sla_status,
          status: c.status,
        };
        
        // Attach citizen_id ONLY for the newly created complaint, leaving mock data unassigned
        if (c.id === newComplaintId) {
            complaintData.citizen_id = user?.id;
        }

        await supabase.from("complaints").upsert(complaintData);
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
        total_complaints: analyzeData.system_summary?.total_complaints || 0,
        critical_issues: analyzeData.system_summary?.critical_issues || 0,
        clusters: analyzeData.system_summary?.clusters || 0,
        top_risk_area: analyzeData.system_summary?.top_risk_area || "Unknown",
        city_health_score: analyzeData.system_summary?.city_health_score || 0,
      });

      // ✅ 5. Insert logs
      for (const log of analyzeData.execution_log) {
        await supabase.from("execution_logs").insert({
          pipeline_run_id: runId,
          log,
        });
      }

      // The newly created complaint is typically the last one added to the mock data
      // newComplaintId was already declared above

      setLoading(false);
      setStep("done");
      router.push(`/portal/track/${newComplaintId}`);
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
      setLoading(false);
      setStep("idle");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <PageHeader title="New Report" subtitle="Select input mode" />

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
          {/* MODE SWITCH */}
          <div className="flex gap-4 mb-6">
            {["form", "image", "audio"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`flex-1 border px-4 py-2 text-xs font-bold uppercase ${
                  mode === m ? "bg-black text-white" : ""
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <Card className="mb-8">
            <label className="text-xs font-bold uppercase tracking-widest block mb-4">
              Describe the issue
            </label>

            {mode === "form" && (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-4 text-sm outline-none focus:border-black h-32 bg-gray-50"
                placeholder="E.g. The streetlight is broken..."
              />
            )}

            {(mode === "image" || mode === "audio") && (
              <input
                type="file"
                className="w-full text-sm"
                accept={mode === "image" ? "image/*" : "audio/*"}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            )}
          </Card>

          <Card className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold uppercase tracking-widest">
                Location
              </label>
            </div>
            <MapPicker
              onSelect={(coords: any) => {
                setLat(coords.lat);
                setLng(coords.lng);
              }}
            />
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