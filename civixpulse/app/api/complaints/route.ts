import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { model } from "@/libs/gemini";

// ---- Safe JSON parser ----
function safeJSON(text: string) {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
}

// ---- Extract structured fields ----
async function extractFields(text: string) {
    const prompt = `
Extract structured complaint info:

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

// ---- Multimodal extractor (image/audio/text) ----
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

        if (file) {
            extractedText = await extractFromFile(file);
        }

        if (!extractedText) {
            return NextResponse.json({ error: "No input" }, { status: 400 });
        }

        const structured = await extractFields(extractedText);

        const complaint = {
            id: uuidv4(),
            source,
            rawText: extractedText,
            category: structured.category || "unknown",
            location: structured.location || "unknown",
            priority: structured.priority || "medium",
            createdAt: new Date(),
        };

        console.log("Saved:", complaint);

        return NextResponse.json({ success: true, complaint });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}