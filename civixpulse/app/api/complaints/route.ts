import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/libs/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const formData = await req.formData();

        const mode = formData.get("mode") as string;
        const latitude = formData.get("latitude");
        const longitude = formData.get("longitude");

        let description = formData.get("description") as string | null;
        const file = formData.get("file") as File | null;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (mode === "image") description = "Image complaint uploaded";
        if (mode === "audio") description = "Audio complaint uploaded";
        if (!description) description = "No description provided";

        const complaint = {
            id: uuidv4(),
            citizen_id: user.id,
            text: description,
            latitude: latitude ? Number(latitude) : null,
            longitude: longitude ? Number(longitude) : null,
            source: mode,
            category: "general",
            severity: "medium",
            priority_score: 0.5,
            officer_name: null,
            sla_status: "pending",
            status: "pending",
            created_at: new Date().toISOString(),
        };

        const { error } = await supabase
            .from("complaints")
            .insert([complaint]);

        if (error) throw error;

        return NextResponse.json({ success: true, complaint });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}