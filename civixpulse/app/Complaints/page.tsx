"use client";

import { useState } from "react";

export default function Complaints() {
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);

    async function handleSubmit() {
        if (!text && !file) {
            alert("Please enter text or upload a file");
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
            setResponse(data);
            setText("");
            setFile(null);
        } catch (err) {
            console.error(err);
            alert("Submission failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="w-full max-w-4xl px-6 py-12">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Register a Complaint
            </h2>

            <div className="flex flex-col gap-4">
                <textarea
                    placeholder="Describe your issue..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="border p-3 rounded-md w-full"
                />

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="border p-2 rounded-md"
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                    {loading ? "Submitting..." : "Submit Complaint"}
                </button>
            </div>

            {/* RESPONSE DISPLAY */}
            {response?.complaint && (
                <div className="mt-6 p-4 border rounded-md bg-green-50">
                    <h3 className="font-semibold mb-2">Complaint Registered ✅</h3>
                    <p><b>Category:</b> {response.complaint.category}</p>
                    <p><b>Location:</b> {response.complaint.location}</p>
                    <p><b>Priority:</b> {response.complaint.priority}</p>
                </div>
            )}
        </section>
    );
}