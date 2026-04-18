"use client";

import { useParams } from "next/navigation";

export default function Verify() {
  const { id } = useParams();

  async function update(status: string) {
    await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    alert("Updated");
  }

  return (
    <div className="p-10">
      <button onClick={() => update("resolved")}>Resolved</button>
      <button onClick={() => update("reopened")}>Reopen</button>
    </div>
  );
}