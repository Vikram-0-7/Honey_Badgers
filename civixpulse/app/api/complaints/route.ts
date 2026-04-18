import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/libs/supabase/server";
import Tesseract from "tesseract.js";
import { extractAudioText } from "@/libs/ai/whisper";

// ---- OCR FUNCTION
async function extractImageText(file: File) {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const { data } = await Tesseract.recognize(buffer, "eng", {
            logger: (m) => console.log("[OCR]", m.status, m.progress),
        });

        return data.text?.trim() || null;
    } catch (err) {
        console.error("OCR failed:", err);
        return null;
    }
}

// ---- MAIN API
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const formData = await req.formData();

        const mode = formData.get("mode") as string;
        const latitude = formData.get("latitude");
        const longitude = formData.get("longitude");

        let description = formData.get("description") as string | null;
        const file = formData.get("file") as File | null;

        // 🔐 AUTH
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized - Please login" },
                { status: 401 }
            );
        }

        // =========================
        // 🔥 MODE HANDLING
        // =========================

        // 🖼️ IMAGE → OCR
        if (mode === "image" && file) {
            console.log("Processing image OCR...");
            const text = await extractImageText(file);

            description = text || "Image uploaded (OCR failed)";
        }

        // 🔊 AUDIO → Process via Whisper (Groq)
        if (mode === "audio" && file) {
            console.log("Processing audio via Groq Whisper...");
            const text = await extractAudioText(file);
            description = text || "Audio complaint uploaded (transcription failed)";
        }

        // 📝 FORM → already handled
        if (!description) {
            description = "No description provided";
        }

        // =========================
        // 📦 BUILD DB OBJECT
        // =========================

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

        // =========================
        // 💾 SAVE TO SUPABASE
        // =========================

        const { error } = await supabase
            .from("complaints")
            .insert([complaint]);

        if (error) {
            console.error("DB ERROR:", error);
            throw error;
        }

        console.log("Complaint saved:", complaint.id);

        return NextResponse.json({
            success: true,
            complaint,
        });

    } catch (err) {
        console.error("API ERROR:", err);

        return NextResponse.json(
            { error: "Failed to submit complaint" },
            { status: 500 }
        );
    }
}