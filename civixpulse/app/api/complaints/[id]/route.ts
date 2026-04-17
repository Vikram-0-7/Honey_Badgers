import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/libs/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Complaint not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ complaint: data });
}