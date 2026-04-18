"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
});

// const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });


export default function SubmitComplaint() {
  const router = useRouter();

  const [mode, setMode] = useState<"form" | "image" | "audio">("form");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (mode === "form" && !description) {
      alert("Enter description");
      return;
    }

    if (mode !== "form" && !file) {
      alert("Upload file");
      return;
    }

    if (!lat || !lng) {
      alert("Select location");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("mode", mode);
    formData.append("latitude", String(lat));
    formData.append("longitude", String(lng));

    if (mode === "form") {
      formData.append("description", description);
    } else {
      formData.append("file", file!);
    }

    try {
      // 🔥 STEP 1: Save complaint
      const res = await fetch("/api/complaints", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        alert("Error submitting complaint");
        setLoading(false);
        return;
      }

      // 🔥 STEP 2: Launch agent (non-blocking)
      console.log("Launching agent for complaint:", data.complaint.id);
      fetch("/api/launch-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: description || "File complaint",
          location: `${lat},${lng}`,
          source: mode,
          complaint_id: data.complaint.id, // 🔥 IMPORTANT
        }),
      }).catch(() => {
        console.log("Agent failed (non-critical)");
      });

      // 🔥 STEP 3: Redirect
      router.push(`/portal/track/${data.complaint.id}`);

    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <PageHeader title="New Report" subtitle="Select input mode" />

      {/* MODE SWITCH */}
      <div className="flex gap-4 mb-6">
        {["form", "image", "audio"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={`flex-1 border px-4 py-2 text-xs font-bold uppercase ${mode === m ? "bg-black text-white" : ""
              }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* FORM */}
      {mode === "form" && (
        <Card className="mb-8">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-4 h-32"
            placeholder="Describe issue..."
          />
        </Card>
      )}

      {/* FILE */}
      {(mode === "image" || mode === "audio") && (
        <Card className="mb-8">
          <input
            type="file"
            accept={mode === "image" ? "image/*" : "audio/*"}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Card>
      )}

      {/* MAP */}
      <Card className="mb-8">
        <MapPicker
          onSelect={(coords: any) => {
            setLat(coords.lat);
            setLng(coords.lng);
          }}
        />
      </Card>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-6 py-3"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}