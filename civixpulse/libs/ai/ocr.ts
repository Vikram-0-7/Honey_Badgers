import Tesseract from "tesseract.js";
import path from "path";

export async function extractImageText(file: File) {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const workerPath = path.join(
            process.cwd(),
            "node_modules",
            "tesseract.js",
            "src",
            "worker-script",
            "node",
            "index.js"
        );

        const { data } = await Tesseract.recognize(buffer, "eng", {
            workerPath, // ✅ FIX
            logger: (m) => console.log("[OCR]", m.status, m.progress),
        });

        return data.text?.trim() || null;

    } catch (err) {
        console.error("OCR failed:", err);
        return null;
    }
}