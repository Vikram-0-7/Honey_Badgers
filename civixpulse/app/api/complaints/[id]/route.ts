import { NextResponse } from "next/server";
import { supabase } from "@/libs/supabase";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const { status, rating } = body;

  const { error } = await supabase
    .from("complaints")
    .update({
      status,
      rating,
      verified: status === "resolved",
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}