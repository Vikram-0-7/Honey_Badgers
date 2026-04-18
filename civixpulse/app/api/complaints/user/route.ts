import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ complaints: [] });

    const { data } = await supabase
        .from("complaints")
        .select("*")
        .eq("citizen_id", user.id)
        .order("created_at", { ascending: false });

    return NextResponse.json({ complaints: data });
}