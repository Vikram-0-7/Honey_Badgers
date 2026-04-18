export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 🔥 send to FastAPI
        const response = await fetch("http://127.0.0.1:8000/agent/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        // 🔥 trigger pipeline async (no await block)
        fetch("http://127.0.0.1:8000/run-pipeline").catch(() => { });

        return Response.json({
            success: true,
            data,
        });

    } catch (err: any) {
        console.error(err);

        return Response.json({
            error: "Agent failed",
        });
    }
}