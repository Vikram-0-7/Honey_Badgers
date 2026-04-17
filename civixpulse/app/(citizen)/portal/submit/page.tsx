"use client";

import PageHeader from "@/components/ui/PageHeader";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import Card from "@/components/ui/Card";
import { useState } from "react";

export default function SubmitComplaint() {
  const [mode, setMode] = useState<"manual" | "image" | "voice">("manual");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "analyzing" | "done">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async () => {
    if (!text) return alert("Enter complaint");

    setLoading(true);
    setStep("analyzing");

    // 🔥 Simulated AI steps
    setStatusMsg("Analyzing complaint...");
    await new Promise((r) => setTimeout(r, 1500));

    setStatusMsg("Detecting clusters...");
    await new Promise((r) => setTimeout(r, 1500));

    setStatusMsg("Generating insights...");
    await new Promise((r) => setTimeout(r, 1500));

    // 🔥 Call your API
    const res = await fetch("/api/launch-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        location: "Madhapur",
        source: "portal",
      }),
    });

    const data = await res.json();

    setLoading(false);
    setStep("done");

    console.log(data);

    // add to supabase
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