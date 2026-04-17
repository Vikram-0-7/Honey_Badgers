"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Complaints() {
    const router = useRouter();
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);

    async function handleSubmit() {
        if (!text && !file) {
            alert("INPUT REQUIRED");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        if (text) formData.append("text", text);
        if (file) formData.append("file", file);
        formData.append("source", "portal");

        try {
            const res = await fetch("/api/complaints", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            router.push(`/complaints/${data.complaint.id}`);
            setResponse(data);
            setText("");
            setFile(null);
        } catch (err) {
            console.error(err);
            alert("SYSTEM ERROR");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="w-full bg-white border-t border-black py-32">
            <div className="mx-auto max-w-5xl px-6 md:px-12 flex flex-col items-center">

                {/* HEADER */}
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black mb-6 text-center">
                    Submit Grievance Node
                </h2>

                <p className="text-xs font-bold uppercase tracking-widest text-black/50 mb-12 text-center">
                    Input channel for autonomous resolution system
                </p>

                {/* FORM */}
                <div className="w-full flex flex-col gap-6">

                    {/* TEXT INPUT */}
                    <textarea
                        placeholder="Describe issue (e.g. water leakage, power outage...)"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full border border-black bg-white p-4 text-sm font-bold uppercase tracking-wide placeholder:text-black/30 focus:outline-none"
                    />

                    {/* FILE INPUT */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-black/50">
                            Attach Evidence (Image / Audio)
                        </label>

                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="border border-black p-3 text-xs font-bold uppercase file:bg-black file:text-white file:border-none file:px-4 file:py-2"
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-black text-white py-4 text-sm font-black uppercase tracking-widest hover:opacity-80 transition"
                    >
                        {loading ? "PROCESSING..." : "INITIATE COMPLAINT"}
                    </button>
                </div>

                {/* RESPONSE PANEL */}
                {response?.complaint && (
                    <div className="mt-16 w-full border border-black p-6 bg-black text-white">
                        <h3 className="text-lg font-black uppercase tracking-widest mb-4">
                            Node Registered ✓
                        </h3>

                        <div className="text-xs uppercase tracking-widest space-y-2">
                            <p>Category: {response.complaint.category}</p>
                            <p>Location: {response.complaint.location}</p>
                            <p>Priority: {response.complaint.priority}</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}