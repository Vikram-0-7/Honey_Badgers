import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // ✅ FIXED
});

export async function extractFromFile(file: File) {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                data: buffer.toString("base64"),
                                mimeType: file.type,
                            },
                        },
                        {
                            text: "Describe the complaint clearly from this input.",
                        },
                    ],
                },
            ],
        });

        return result.response.text();

    } catch (err) {
        console.error("Gemini extraction failed:", err);
        return null;
    }
}