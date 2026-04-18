"""
Impact Score Decay — Priority Escalation Over Time
====================================================
Unresolved complaints automatically increase in priority score
as they age. This ensures nothing falls through the cracks.

Formula:
    new_score = base_score × (1 + age_hours × DECAY_RATE)

Severity Escalation Thresholds:
    - P4 → P3 after 24 hours unresolved
    - P3 → P2 after 48 hours unresolved
    - P2 → P1 after 72 hours unresolved (critical escalation)

This module can be called on-demand via API or scheduled as a
background task running every 30 minutes.
"""

from datetime import datetime
from models.complaint import Complaint, SeverityLevel, ComplaintStatus


# ── Configuration ──
DECAY_RATE = 0.05  # 5% increase per hour
MAX_SCORE_MULTIPLIER = 5.0  # Cap at 5× original score

# Hours after which severity escalates to the next level
ESCALATION_THRESHOLDS = {
    SeverityLevel.P4: 24,  # P4 → P3 after 24h
    SeverityLevel.P3: 48,  # P3 → P2 after 48h
    SeverityLevel.P2: 72,  # P2 → P1 after 72h
}

SEVERITY_UPGRADE = {
    SeverityLevel.P4: SeverityLevel.P3,
    SeverityLevel.P3: SeverityLevel.P2,
    SeverityLevel.P2: SeverityLevel.P1,
}

# Statuses that are considered "unresolved"
UNRESOLVED_STATUSES = {
    ComplaintStatus.PENDING,
    ComplaintStatus.CLASSIFIED,
    ComplaintStatus.ASSIGNED,
    ComplaintStatus.IN_PROGRESS,
}


def calculate_age_hours(complaint: Complaint) -> float:
    """Calculate how many hours old a complaint is."""
    try:
        created = datetime.fromisoformat(complaint.created_at)
    except (ValueError, TypeError):
        return 0.0
    
    age = (datetime.utcnow() - created).total_seconds() / 3600
    return max(age, 0.0)


def apply_score_decay(complaints: list[Complaint]) -> dict:
    """
    Apply impact score decay to all unresolved complaints.
    
    For each unresolved complaint:
    1. Calculate age in hours
    2. Apply decay formula: new_score = base_score × (1 + age_hours × DECAY_RATE)
    3. Check severity escalation thresholds
    4. Update complaint fields
    
    Args:
        complaints: List of all complaints (will be modified in place).
    
    Returns:
        Summary dict with escalation counts and details.
    """
    log_prefix = "[SCORE_DECAY]"
    
    escalated = []
    score_bumped = []
    total_processed = 0
    
    print(f"{log_prefix} ═══════════════════════════════════════════")
    print(f"{log_prefix} Running impact score decay on {len(complaints)} complaints...")
    print()
    
    for complaint in complaints:
        # Skip resolved/verified complaints
        if complaint.status not in UNRESOLVED_STATUSES:
            continue
        
        total_processed += 1
        age_hours = calculate_age_hours(complaint)
        
        if age_hours <= 0:
            continue
        
        # ── Step 1: Score Decay ──
        base_score = complaint.priority_score or 0.0
        if base_score <= 0:
            base_score = 10.0  # Minimum baseline for unscored complaints
        
        decay_multiplier = min(1 + (age_hours * DECAY_RATE), MAX_SCORE_MULTIPLIER)
        new_score = round(base_score * decay_multiplier, 2)
        
        if new_score != complaint.priority_score:
            old_score = complaint.priority_score
            complaint.priority_score = new_score
            complaint.updated_at = datetime.utcnow().isoformat()
            
            score_bumped.append({
                "complaint_id": complaint.id,
                "old_score": old_score,
                "new_score": new_score,
                "age_hours": round(age_hours, 1),
                "multiplier": round(decay_multiplier, 2),
            })
            
            print(f"{log_prefix} Score bump: {complaint.id[:8]} | "
                  f"{old_score:.1f} → {new_score:.1f} | "
                  f"Age: {age_hours:.1f}h | Multiplier: {decay_multiplier:.2f}x")
        
        # ── Step 2: Severity Escalation ──
        if complaint.severity and complaint.severity in ESCALATION_THRESHOLDS:
            threshold = ESCALATION_THRESHOLDS[complaint.severity]
            
            if age_hours >= threshold:
                old_severity = complaint.severity
                new_severity = SEVERITY_UPGRADE[complaint.severity]
                complaint.severity = new_severity
                complaint.updated_at = datetime.utcnow().isoformat()
                
                # Record escalation in agent notes
                if "score_decay" not in complaint.agent_notes:
                    complaint.agent_notes["score_decay"] = []
                complaint.agent_notes["score_decay"].append({
                    "event": "severity_escalated",
                    "from": old_severity.value,
                    "to": new_severity.value,
                    "age_hours": round(age_hours, 1),
                    "threshold_hours": threshold,
                    "timestamp": datetime.utcnow().isoformat(),
                })
                
                # Append to reason
                escalation_msg = (
                    f"Auto-escalated {old_severity.value} → {new_severity.value} "
                    f"after {age_hours:.0f}h unresolved (threshold: {threshold}h)"
                )
                if complaint.reason:
                    complaint.reason += f" -> {escalation_msg}"
                else:
                    complaint.reason = escalation_msg
                
                escalated.append({
                    "complaint_id": complaint.id,
                    "old_severity": old_severity.value,
                    "new_severity": new_severity.value,
                    "age_hours": round(age_hours, 1),
                    "threshold_hours": threshold,
                    "text_preview": complaint.text[:60],
                })
                
                print(f"{log_prefix} [!!] SEVERITY ESCALATED: {complaint.id[:8]} | "
                      f"{old_severity.value} → {new_severity.value} | "
                      f"Age: {age_hours:.1f}h (threshold: {threshold}h)")
    
    # ── Summary ──
    print()
    print(f"{log_prefix} ─────────────────────────────────────────")
    print(f"{log_prefix} Processed: {total_processed} unresolved complaints")
    print(f"{log_prefix} Score bumps: {len(score_bumped)}")
    print(f"{log_prefix} Severity escalations: {len(escalated)}")
    print(f"{log_prefix} ═══════════════════════════════════════════")
    print()
    
    return {
        "total_processed": total_processed,
        "score_bumped_count": len(score_bumped),
        "severity_escalated_count": len(escalated),
        "score_bumps": score_bumped,
        "severity_escalations": escalated,
        "timestamp": datetime.utcnow().isoformat(),
    }


def run_decay_cycle(pipeline_runs: dict) -> dict:
    """
    Standalone function that runs the decay cycle across ALL
    stored pipeline runs. Designed to be called from an API
    endpoint or background scheduler.
    
    Args:
        pipeline_runs: The in-memory dict of pipeline results (from main.py).
    
    Returns:
        Aggregated summary of all decay operations.
    """
    log_prefix = "[DECAY_CYCLE]"
    
    if not pipeline_runs:
        print(f"{log_prefix} No pipeline runs found. Nothing to decay.")
        return {
            "message": "No pipeline runs to process",
            "total_runs": 0,
            "total_escalations": 0,
            "total_score_bumps": 0,
        }
    
    all_escalations = []
    all_score_bumps = []
    total_processed = 0
    
    print(f"{log_prefix} Starting decay cycle across {len(pipeline_runs)} pipeline run(s)...")
    print()
    
    for run_id, result in pipeline_runs.items():
        print(f"{log_prefix} Processing run: {run_id[:8]}...")
        decay_result = apply_score_decay(result.complaints)
        total_processed += decay_result["total_processed"]
        all_escalations.extend(decay_result["severity_escalations"])
        all_score_bumps.extend(decay_result["score_bumps"])
    
    summary = {
        "message": "Score decay cycle completed",
        "total_runs_processed": len(pipeline_runs),
        "total_complaints_processed": total_processed,
        "total_score_bumps": len(all_score_bumps),
        "total_severity_escalations": len(all_escalations),
        "severity_escalations": all_escalations,
        "score_bumps": all_score_bumps[:20],  # Limit response size
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    print(f"{log_prefix} Decay cycle complete. "
          f"Processed {total_processed} complaints, "
          f"{len(all_escalations)} escalation(s), "
          f"{len(all_score_bumps)} score bump(s).")
    
    return summary
