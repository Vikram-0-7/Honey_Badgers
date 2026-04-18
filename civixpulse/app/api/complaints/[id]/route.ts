import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

// ✅ GET complaint
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ FIX
) {
  try {
    const supabase = await createClient();

    const { id } = await context.params; // ✅ FIX (await here)

    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ complaint: data });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch complaint" },
      { status: 500 }
    );
  }
}

// ✅ PATCH
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ FIX
) {
  try {
    const supabase = await createClient();

    const { id } = await context.params; // ✅ FIX

    const { status } = await req.json();

    const { error } = await supabase
      .from("complaints")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}