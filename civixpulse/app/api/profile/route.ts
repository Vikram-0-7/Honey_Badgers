import { NextResponse } from "next/server";
import { supabase } from "@/libs/supabase";

// ---- GET PROFILE ----
export async function GET() {
    // ⚠️ replace with auth later
    const userId = "demo-user-id";

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
}

// ---- UPDATE PROFILE ----
export async function POST(req: Request) {
    const body = await req.json();

    const { full_name, email, zone } = body;

    const userId = "demo-user-id";

    const { error } = await supabase
        .from("profiles")
        .upsert([
            {
                id: userId,
                full_name,
                email,
                zone,
                updated_at: new Date().toISOString(),
            },
        ]);

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}