"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ComplaintDetail() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState<any>(null);

    useEffect(() => {
        async function fetchComplaint() {
            const res = await fetch(`/api/complaints/${id}`);
            const data = await res.json();
            setComplaint(data.complaint);
        }

        if (id) fetchComplaint();
    }, [id]);

    if (!complaint) {
        return (
            <div className="w-full py-32 text-center font-bold uppercase">
                Loading Node...
            </div>
        );
    }

    return (
        <section className="w-full bg-white py-32 border-t border-black">
            <div className="mx-auto max-w-4xl px-6">

                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-10">
                    Complaint Node
                </h1>

                <div className="border border-black p-6 flex flex-col gap-4">

                    <p className="text-xs uppercase font-bold tracking-widest text-black/50">
                        ID: {complaint.id}
                    </p>

                    <p className="text-sm uppercase font-bold">
                        Category: {complaint.category}
                    </p>

                    <p className="text-sm uppercase font-bold">
                        Location: {complaint.location}
                    </p>

                    <p className="text-sm uppercase font-bold">
                        Priority: {complaint.priority}
                    </p>

                    <p className="text-sm uppercase font-bold">
                        Status: {complaint.status}
                    </p>

                    <div className="border-t border-black pt-4 mt-4">
                        <p className="text-xs uppercase font-bold text-black/50 mb-2">
                            Raw Input
                        </p>
                        <p className="text-sm">{complaint.raw_text}</p>
                    </div>

                </div>
            </div>
        </section>
    );
}