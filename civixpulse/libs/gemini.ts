// import {
//     GoogleGenAI,
//     ThinkingLevel,
//     createUserContent,
//     createPartFromUri,
// } from "@google/genai";

// const ai = new GoogleGenAI({
//     apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
// });

// function safeParse(text: string) {
//     try {
//         return JSON.parse(text.replace(/```json|```/g, ""));
//     } catch {
//         return {
//             text,
//             category: "Other",
//             severity: "P3",
//             priority_score: 50,
//         };
//     }
// }

// export async function analyzeText(text: string) {
//     const res = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: `
// Classify this civic complaint:
// "${text}"

// Return JSON:
// {
//   "text": "...",
//   "category": "...",
//   "severity": "P1|P2|P3|P4",
//   "priority_score": number
// }
// `,
//         config: {
//             thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
//         },
//     });

//     return safeParse(res.text);
// }

// export async function analyzeImage(base64: string) {
//     const res = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: [
//             {
//                 inlineData: {
//                     mimeType: "image/jpeg",
//                     data: base64,
//                 },
//             },
//             {
//                 text: `
// Analyze civic issue.
// Return JSON:
// {
//   "text": "...",
//   "category": "...",
//   "severity": "P1|P2|P3|P4",
//   "priority_score": number
// }
// `,
//             },
//         ],
//     });

//     return safeParse(res.text);
// }

// export async function analyzeAudio(file: File) {
//     const uploaded = await ai.files.upload({
//         file,
//         config: { mimeType: file.type },
//     });

//     const res = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: createUserContent([
//             createPartFromUri(uploaded.uri, uploaded.mimeType),
//             `
// Transcribe and classify complaint.
// Return JSON:
// {
//   "text": "...",
//   "category": "...",
//   "severity": "P1|P2|P3|P4",
//   "priority_score": number
// }
// `,
//         ]),
//     });

//     return safeParse(res.text);
// }