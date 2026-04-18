import OpenAI from "openai";

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function extractAudioText(file: File) {
    try {
        const response = await groq.audio.transcriptions.create({
            file: file,
            model: "whisper-large-v3-turbo",
        });

        return response.text;
    } catch (err) {
        console.error("Groq Whisper extraction failed:", err);
        return null;
    }
}
