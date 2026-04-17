import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔥 server only
);

export async function POST(req: Request) {
    const { email } = await req.json();

    // 1. Create user
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (error) return Response.json({ error: error.message });

    // 2. Set role = officer
    await supabaseAdmin.from("profiles").insert({
        id: data.user.id,
        role: "officer",
    });

    return Response.json({ success: true });
}