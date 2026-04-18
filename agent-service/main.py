"""
Civix-Pulse — FastAPI Microservice Entry Point
================================================
Agentic Governance & Grievance Resolution Swarm

This is the main entry point for the Civix-Pulse agent microservice.
It exposes REST API endpoints that trigger the multi-agent pipeline
and return processed complaint data.

Version: 2.0 (Mock Mode — No Database)
Stack: FastAPI + Python
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import asyncio

from models.complaint import Complaint, ComplaintSource, PipelineResult
from services.pipeline import run_pipeline
from services.mock_data import generate_mock_complaints, generate_mock_officers
from services.score_decay import run_decay_cycle, apply_score_decay

# ── App Initialization ──
app = FastAPI(
    title="Civix-Pulse Agent Service",
    description=(
        "AI-powered multi-agent pipeline for civic grievance resolution. "
        "Ingests complaints, classifies them, detects systemic clusters, "
        "and auto-assigns field officers."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS — Allow Next.js frontend to call this API ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your Next.js domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory store for pipeline results ──
pipeline_runs: dict[str, PipelineResult] = {}


# ═══════════════════════════════════════════════════
# REQUEST / RESPONSE MODELS
# ═══════════════════════════════════════════════════

class ComplaintSubmission(BaseModel):
    """Schema for submitting a new complaint via API."""
    text: str
    location: str
    latitude: Optional[float] = 17.385
    longitude: Optional[float] = 78.4867
    source: Optional[str] = "portal"
    citizen_id: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    service: str
    version: str
    timestamp: str


# ═══════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════

@app.get("/", response_model=HealthResponse)
async def root():
    """Health check — confirms the agent service is running."""
    return HealthResponse(
        status="operational",
        service="Civix-Pulse Agent Service",
        version="2.0.0",
        timestamp=datetime.utcnow().isoformat(),
    )


@app.get("/run-pipeline", response_model=PipelineResult)
async def execute_pipeline():
    """
    Execute the full 4-agent pipeline on mock data.

    Flow: Ingestion → Priority → Auditor → Resolver

    Returns the complete pipeline result including all processed
    complaints, detected clusters, and officer assignments.
    """
    try:
        result = run_pipeline()
        # Store result for later retrieval
        pipeline_runs[result.pipeline_run_id] = result
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline execution failed: {str(e)}")


@app.post("/agent/analyze", response_model=PipelineResult)
async def analyze_complaint(submission: ComplaintSubmission):
    """
    Submit a single complaint and run it through the full agent pipeline.

    This endpoint accepts a complaint submission, creates a Complaint object,
    and processes it through all 4 agents alongside existing mock data.
    """
    try:
        # Create complaint from submission
        source_map = {
            "portal": ComplaintSource.PORTAL,
            "whatsapp": ComplaintSource.WHATSAPP,
            "voice": ComplaintSource.VOICE,
            "ocr": ComplaintSource.OCR,
            "twitter": ComplaintSource.TWITTER,
        }

        new_complaint = Complaint(
            text=submission.text,
            location=submission.location,
            latitude=submission.latitude,
            longitude=submission.longitude,
            source=source_map.get(submission.source, ComplaintSource.PORTAL),
            citizen_id=submission.citizen_id,
        )

        # Load mock complaints + append the new one
        complaints = generate_mock_complaints()
        complaints.append(new_complaint)

        result = run_pipeline(complaints)
        pipeline_runs[result.pipeline_run_id] = result
        return result.model_dump()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/agent/status/{run_id}")
async def get_pipeline_status(run_id: str):
    """Get the status/result of a previous pipeline run by ID."""
    if run_id not in pipeline_runs:
        raise HTTPException(status_code=404, detail=f"Pipeline run {run_id} not found")
    return pipeline_runs[run_id]


@app.get("/complaints")
async def list_mock_complaints():
    """
    List all mock complaints (raw, unprocessed).
    Useful for frontend testing before running the pipeline.
    """
    complaints = generate_mock_complaints()
    return {
        "total": len(complaints),
        "complaints": [c.model_dump() for c in complaints],
    }


@app.get("/officers")
async def list_mock_officers():
    """
    List all mock field officers.
    Useful for frontend testing of the officer assignment board.
    """
    officers = generate_mock_officers()
    return {
        "total": len(officers),
        "officers": [o.model_dump() for o in officers],
    }


@app.get("/dashboard/stats")
async def get_dashboard_stats():
    """
    Return dashboard stat card data.
    If a pipeline has been run, returns stats from the most recent run.
    Otherwise, returns zeroed stats.
    """
    if not pipeline_runs:
        return {
            "total_complaints": 0,
            "active_incidents": 0,
            "clusters_detected": 0,
            "avg_resolution_time_hrs": 0,
            "sla_breaches": 0,
            "category_breakdown": {},
            "severity_breakdown": {},
        }

    # Get the most recent pipeline run
    latest = list(pipeline_runs.values())[-1]

    # Compute category and severity breakdowns
    category_counts = {}
    severity_counts = {}
    for c in latest.complaints:
        cat = c.category or "Unknown"
        category_counts[cat] = category_counts.get(cat, 0) + 1
        sev = c.severity.value if c.severity else "Unclassified"
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

    return {
        "total_complaints": latest.total_complaints,
        "active_incidents": sum(1 for c in latest.complaints if c.status.value in ("assigned", "in_progress")),
        "clusters_detected": latest.total_clusters,
        "avg_resolution_time_hrs": 4.5,  # Mock value — will be computed from Supabase in production
        "sla_breaches": 0,  # Mock value
        "category_breakdown": category_counts,
        "severity_breakdown": severity_counts,
    }


# ═══════════════════════════════════════════════════
# SCORE DECAY / CRON ENDPOINTS
# ═══════════════════════════════════════════════════

@app.post("/cron/score-decay")
async def trigger_score_decay():
    """
    Trigger the impact score decay cycle on all stored pipeline runs.
    
    This endpoint can be called manually or by a scheduler (e.g., Vercel Cron).
    It increases priority scores of unresolved complaints over time and
    escalates severity levels when age thresholds are crossed.
    
    Thresholds:
    - P4 → P3 after 24 hours
    - P3 → P2 after 48 hours
    - P2 → P1 after 72 hours
    """
    try:
        result = run_decay_cycle(pipeline_runs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Score decay failed: {str(e)}")


@app.get("/cron/score-decay/status")
async def score_decay_status():
    """Check how many unresolved complaints exist and their age distribution."""
    if not pipeline_runs:
        return {"message": "No pipeline data", "total_unresolved": 0}
    
    latest = list(pipeline_runs.values())[-1]
    unresolved_statuses = {"pending", "classified", "assigned", "in_progress"}
    unresolved = [
        c for c in latest.complaints
        if c.status.value in unresolved_statuses
    ]
    
    return {
        "total_unresolved": len(unresolved),
        "total_complaints": len(latest.complaints),
        "unresolved_by_severity": {
            sev: sum(1 for c in unresolved if c.severity and c.severity.value == sev)
            for sev in ["P1", "P2", "P3", "P4"]
        },
    }


# ═══════════════════════════════════════════════════
# BACKGROUND SCHEDULER
# ═══════════════════════════════════════════════════

async def score_decay_scheduler():
    """
    Background task that runs the score decay cycle every 30 minutes.
    Started automatically when the server boots.
    """
    while True:
        await asyncio.sleep(1800)  # 30 minutes
        if pipeline_runs:
            print("\n[SCHEDULER] Running automatic score decay cycle...")
            try:
                run_decay_cycle(pipeline_runs)
            except Exception as e:
                print(f"[SCHEDULER] Score decay error: {e}")


@app.on_event("startup")
async def startup_event():
    """Launch background tasks on server startup."""
    asyncio.create_task(score_decay_scheduler())
    print("[STARTUP] Score decay scheduler started (runs every 30 minutes)")


# ═══════════════════════════════════════════════════
# STARTUP
# ═══════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
