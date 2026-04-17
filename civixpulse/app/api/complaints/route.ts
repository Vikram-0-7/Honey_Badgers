import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { model } from "@/libs/gemini";
import { supabase } from "@/libs/supabase";

// ---- Safe JSON
function safeJSON(text: string) {
    try {
        const match = text.match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : {};
    } catch {
        return {};
    }
}

// ---- Extract from file (SAFE)
async function extractFromFile(file: File) {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await model.generateContent([
            {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: file.type,
                },
            },
            {
                text: "Describe the complaint clearly",
            },
        ]);

        return await result.response.text();
    } catch (err) {
        console.error("File extraction failed:", err);
        return "User uploaded a file (AI extraction failed)";
    }
}

// ---- Enrich (SAFE)
async function enrich(text: string) {
    try {
        const result = await model.generateContent(`
Extract:
- category
- priority

Return JSON:
{
  "category": "...",
  "priority": "low | medium | high"
}

Text:
${text}
`);

        return safeJSON(await result.response.text());
    } catch (err) {
        console.error("AI enrich failed:", err);
        return { category: "other", priority: "medium" };
    }
}

// ---- MAIN
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const mode = formData.get("mode") as string;
        const lat = formData.get("lat");
        const lng = formData.get("lng");

        let description = formData.get("description") as string | null;
        const file = formData.get("file") as File | null;

        // 🔥 Get user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // ---- Mode handling (SAFE)
        if ((mode === "image" || mode === "audio") && file) {
            description = await extractFromFile(file);
        }

        // ---- Fallback (IMPORTANT)
        if (!description) {
            description = "No description provided";
        }

        // ---- AI enrichment (SAFE)
        const ai = await enrich(description);

        // ---- Build complaint
        const complaint = {
            id: uuidv4(),
            user_id: user?.id || null,
            source: mode,
            raw_text: description,
            category: ai.category || "other",
            priority: ai.priority || "medium",
            location: `${lat},${lng}`,
            latitude: lat ? Number(lat) : null,
            longitude: lng ? Number(lng) : null,
            status: "pending",
            created_at: new Date().toISOString(),
        };

        const { error } = await supabase
            .from("complaints")
            .insert([complaint]);

        if (error) throw error;

        return NextResponse.json({ success: true, complaint });

    } catch (err) {
        console.error("API ERROR:", err);

        return NextResponse.json(
            { error: "Something went wrong but complaint may still be saved" },
            { status: 500 }
        );
    }
}