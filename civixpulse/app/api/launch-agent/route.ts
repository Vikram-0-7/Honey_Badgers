import { createClient } from "@/libs/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

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

        // 🔥 Send email via Resend if user is logged in
        if (user?.email) {
            const complaintId = body.complaint_id || "Unknown";
            
            console.log("Sending acknowledgment email to:", user.email);
            
            await resend.emails.send({
                from: "CivixPulse Updates <onboarding@resend.dev>",
                to: [user.email],
                subject: `Complaint Received (ID: ${complaintId.split('-')[0]})`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
                        <h2 style="color: #000;">Complaint Acknowledgment</h2>
                        <p>Hello,</p>
                        <p>We have successfully received your complaint.</p>
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <strong>Complaint ID:</strong> ${complaintId}<br/>
                            <strong>Status:</strong> Processing<br/>
                        </div>
                        <p>Our autonomous AI agents have already analyzed your report and are assigning it to the appropriate field officer.</p>
                        <p>You can track the live status of your resolution on your dashboard.</p>
                        <br/>
                        <p style="color: #666; font-size: 14px;">Thank you,<br/><strong>CivixPulse Swarm</strong></p>
                    </div>
                `,
            }).catch(e => console.error("Failed to send email:", e));
        }

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
        console.error(err);

        return Response.json({
            error: err.message || "Agent failed",
        });
    }
}