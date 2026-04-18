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
            // The pipeline returns all complaints, the newly submitted one is the last one
            const latestComplaint = data.complaints?.[data.complaints.length - 1];
            
            const complaintId = latestComplaint?.id || "Unknown";
            const category = latestComplaint?.category || "Uncategorized";
            const severity = latestComplaint?.severity || "N/A";
            const officerName = latestComplaint?.officer_name || "Pending Assignment";
            const slaDeadline = latestComplaint?.sla_deadline_hours ? `${latestComplaint.sla_deadline_hours} Hours` : "TBD";
            const status = latestComplaint?.status || "Processing";
            
            console.log("Sending rich acknowledgment email to:", user.email);
            
            await resend.emails.send({
                from: "CivixPulse Updates <onboarding@resend.dev>",
                to: [user.email],
                subject: `Complaint Received & Assigned (ID: ${complaintId.split('-')[0]})`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
                        <h2 style="color: #000;">Complaint Analyzed & Assigned</h2>
                        <p>Hello,</p>
                        <p>Our autonomous AI Swarm has successfully received and analyzed your report.</p>
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <strong>Complaint ID:</strong> ${complaintId}<br/><br/>
                            <strong>Category:</strong> ${category}<br/>
                            <strong>Severity:</strong> ${severity}<br/><br/>
                            <strong>Officer Assigned:</strong> ${officerName}<br/>
                            <strong>Expected Resolution (SLA):</strong> ${slaDeadline}<br/>
                            <strong>Status:</strong> ${status}<br/>
                        </div>
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