import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { model } from "@/libs/gemini";
import { supabase } from "@/libs/supabase";

// ---- Safe JSON ----
function safeJSON(text: string) {
    try {
        const match = text.match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : {};
    } catch {
        return {};
    }
}

// ---- Extract structured fields ----
async function extractFields(text: string) {
    const prompt = `
Extract structured complaint info from this text:

"${text}"

Return STRICT JSON:
{
  "category": "...",
  "location": "...",
  "priority": "low | medium | high"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return safeJSON(response);
}

// ---- Gemini multimodal (image/audio) ----
async function extractFromFile(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: buffer.toString("base64"),
                mimeType: file.type,
            },
        },
        {
            text: "Extract complaint details or transcribe clearly.",
        },
    ]);

    return result.response.text();
}

// ---- MAIN HANDLER ----
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const text = formData.get("text") as string | null;
        const file = formData.get("file") as File | null;
        const source = (formData.get("source") as string) || "portal";

        let extractedText = text || "";

        // ✅ Handle file input (image/audio)
        if (file) {
            extractedText = await extractFromFile(file);
        }

        if (!extractedText) {
            return NextResponse.json(
                { error: "No input provided" },
                { status: 400 }
            );
        }

        // ✅ Gemini structured extraction
        const structured = await extractFields(extractedText);

        // ---- FINAL OBJECT ----
        const complaint = {
            id: uuidv4(),
            source,
            raw_text: extractedText,
            category: structured.category || "unknown",
            location: structured.location || "unknown",
            priority: structured.priority || "medium",
            status: "pending", // 🔥 important for next agents
            created_at: new Date().toISOString(),
        };

        // ✅ Save to Supabase
        const { error } = await supabase
            .from("complaints")
            .insert([complaint]);

        if (error) {
            console.error("DB ERROR:", error);
            return NextResponse.json(
                { error: "Database insert failed" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            complaint,
        });

    } catch (err) {
        console.error("API ERROR:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}