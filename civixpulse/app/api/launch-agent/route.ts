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
        console.log("/analyze route response: ", data);

        // 🔁 Call pipeline trigger
        const pipelineResponse = await fetch("http://127.0.0.1:8000/run-pipeline");
        const pipelineData = await pipelineResponse.json();
        console.log("/run-pipeline route response: ", pipelineData);

        return Response.json({
            success: true,
            data,
            pipelineData,
        });
    } catch (err: any) {
        return Response.json({
            error: err.message,
        });
    }
}