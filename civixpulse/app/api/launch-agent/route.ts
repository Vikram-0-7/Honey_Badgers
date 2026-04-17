// app/api/launch-agent/route.ts

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 🔥 Call FastAPI
        const response = await fetch("http://127.0.0.1:8000/agent/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        // 🔁 Call pipeline trigger
        await fetch("http://127.0.0.1:8000/run-pipeline");

        return Response.json({
            success: true,
            data,
        });
    } catch (err: any) {
        return Response.json({
            error: err.message,
        });
    }
}