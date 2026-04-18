"""
Civix-Pulse Agent Pipeline Orchestrator
========================================
Orchestrates the 4-agent sequential pipeline:

  Ingestion → Priority → Auditor → Resolver

This module is the core engine that ties all agents together.
"""

import time
from datetime import datetime

from agents.ingestion_agent import IngestionAgent
from agents.priority_agent import PriorityAgent
from agents.auditor_agent import AuditorAgent
from agents.resolver_agent import ResolverAgent
from models.complaint import Complaint, Cluster, PipelineResult, Alert, SeverityLevel, Prediction, Correlation, CityHealth, TopRiskArea, MostAffectedCategory, SystemSummary
from services.mock_data import generate_mock_complaints
from collections import defaultdict


def generate_predictions(complaints: list[Complaint]) -> list[Prediction]:
    predictions = []
    category_counts = defaultdict(int)
    for c in complaints:
        if c.category:
            category_counts[c.category] += 1
            
    for category, count in category_counts.items():
        if count >= 3:
            predictions.append(Prediction(
                category=category,
                prediction=f"{category} failure likely in next 24 hours",
                trend="increasing",
                confidence="medium"
            ))
    return predictions


def generate_correlations(complaints: list[Complaint]) -> list[Correlation]:
    correlations = []
    location_categories = defaultdict(set)
    for c in complaints:
        if c.location and c.category:
            location_categories[c.location.lower()].add(c.category)
            
    for loc, cats in location_categories.items():
        if len(cats) >= 2:
            correlations.append(Correlation(
                location=loc.title(),
                correlation=f"{list(cats)[0]} issues affecting {list(cats)[1]} infrastructure",
                departments=list(cats),
                reason="Multiple categories detected in same region"
            ))
    return correlations


def calculate_city_health(complaints: list[Complaint], clusters: list[Cluster]) -> CityHealth:
    p1_count = sum(1 for c in complaints if c.severity == SeverityLevel.P1)
    score = max(0, 100 - (p1_count * 10 + len(clusters) * 5))
    if score > 80:
        status = "Healthy"
    elif score >= 50:
        status = "Moderate Risk"
    else:
        status = "Critical"
    return CityHealth(score=score, status=status)


def run_pipeline(complaints: list[Complaint] | None = None) -> PipelineResult:
    """
    Execute the full 4-agent sequential pipeline.

    Flow:
    1. Load complaints (mock or provided)
    2. For each complaint: Ingestion Agent → Priority Agent
    3. Run Auditor Agent on all classified complaints (cluster analysis)
    4. Run Resolver Agent on all complaints (officer assignment)
    5. Compile and return PipelineResult

    Args:
        complaints: Optional list of complaints. If None, loads mock data.

    Returns:
        PipelineResult with all processed complaints, clusters, and assignments.
    """
    execution_log: list[str] = []
    alerts: list[Alert] = []
    start_time = time.time()

    # ── Banner ──
    print("="*60)
    print("         CIVIX-PULSE  --  Agent Pipeline v2.0            ")
    print("      Agentic Governance & Grievance Resolution         ")
    print("="*60)
    print()

    # Step 0: Load complaints
    if complaints is None:
        complaints = generate_mock_complaints()
    execution_log.append(f"Loaded {len(complaints)} complaints")
    print(f"[INPUT] Loaded {len(complaints)} complaints into pipeline")
    print("-" * 58)
    print()

    # ── Initialize agents ──
    ingestion_agent = IngestionAgent()
    priority_agent = PriorityAgent()
    auditor_agent = AuditorAgent()
    resolver_agent = ResolverAgent()

    # ══════════════════════════════════════════════════════════
    # PHASE 1: Ingestion + Priority (per-complaint)
    # ══════════════════════════════════════════════════════════
    print("=" * 58)
    print("  PHASE 1: INGESTION + CLASSIFICATION")
    print("=" * 58)
    print()

    for i, complaint in enumerate(complaints):
        print(f"-- Complaint {i + 1}/{len(complaints)} --")

        # Agent 1: Ingestion
        complaint = ingestion_agent.process(complaint)
        execution_log.append(f"Ingestion: {complaint.id[:8]} - {complaint.source.value}")

        # Agent 2: Priority
        complaint = priority_agent.process(complaint)
        execution_log.append(
            f"Priority: {complaint.id[:8]} - {complaint.category} / "
            f"{complaint.severity.value} / Score: {complaint.priority_score:.1f}"
        )

        # Generate Alerts
        if complaint.severity == SeverityLevel.P1:
            alerts.append(Alert(
                type="CRITICAL_ALERT",
                message=f"Critical {complaint.category.lower()} issue detected in {complaint.location} — immediate action required",
                severity="P1",
                area=complaint.location,
                complaint_id=complaint.id
            ))

    # ══════════════════════════════════════════════════════════
    # PHASE 2: Cluster Analysis (batch)
    # ══════════════════════════════════════════════════════════
    print()
    print("=" * 58)
    print("  PHASE 2: SYSTEMIC CLUSTER ANALYSIS")
    print("=" * 58)
    print()

    clusters: list[Cluster] = auditor_agent.process(complaints)
    execution_log.append(f"Auditor: {len(clusters)} cluster(s) detected")

    for cluster in clusters:
        if cluster.count >= 3:
            alerts.append(Alert(
                type="CLUSTER_ALERT",
                message=f"Systemic {cluster.category.lower()} infrastructure failure in {cluster.affected_area}",
                severity="HIGH",
                area=cluster.affected_area,
                cluster_id=cluster.cluster_id
            ))

    # ══════════════════════════════════════════════════════════
    # PHASE 3: Officer Assignment (batch)
    # ══════════════════════════════════════════════════════════
    print()
    print("=" * 58)
    print("  PHASE 3: OFFICER ASSIGNMENT")
    print("=" * 58)
    print()

    assignments: list[dict] = resolver_agent.process_batch(complaints)
    execution_log.append(f"Resolver: {len(assignments)} assignments made")

    # ══════════════════════════════════════════════════════════
    # PHASE 4: City Intelligence (Predictions, Correlations, Health)
    # ══════════════════════════════════════════════════════════
    print()
    print("=" * 58)
    print("  PHASE 4: CITY INTELLIGENCE")
    print("=" * 58)
    print()

    predictions = generate_predictions(complaints)
    for p in predictions:
        execution_log.append(f"[PREDICTION] {p.category} complaints rising -> escalation likely")
        print(f"[PREDICTION] {p.category} complaints rising -> escalation likely")

    correlations = generate_correlations(complaints)
    for c in correlations:
        execution_log.append(f"[CORRELATION] Multi-department issue detected in {c.location}: {c.departments}")
        print(f"[CORRELATION] Multi-department issue detected in {c.location}")

    city_health = calculate_city_health(complaints, clusters)
    execution_log.append(f"[CITY HEALTH] Score={city_health.score} -> {city_health.status}")
    print(f"[CITY HEALTH] Score={city_health.score} -> {city_health.status}")

    # ══════════════════════════════════════════════════════════
    # SUMMARY
    # ══════════════════════════════════════════════════════════
    elapsed = time.time() - start_time
    execution_log.append(f"Pipeline completed in {elapsed:.2f}s")

    print()
    print("+" + "-"*58 + "+")
    print("|                  PIPELINE SUMMARY                      |")
    print("+" + "-"*58 + "+")
    print(f"|  Total Complaints:  {len(complaints):<36}|")
    print(f"|  Clusters Detected: {len(clusters):<36}|")
    print(f"|  Officers Assigned: {len(assignments):<36}|")
    print(f"|  Execution Time:    {elapsed:.2f}s{' ' * (34 - len(f'{elapsed:.2f}s'))}|")
    print("+" + "-"*58 + "+")
    print()

    # ── Category breakdown & System Summary ──
    category_counts: dict[str, int] = {}
    severity_counts: dict[str, int] = {}
    area_risk_scores: dict[str, int] = defaultdict(int)
    
    for c in complaints:
        cat = c.category or "Unknown"
        category_counts[cat] = category_counts.get(cat, 0) + 1
        sev = c.severity.value if c.severity else "Unclassified"
        severity_counts[sev] = severity_counts.get(sev, 0) + 1
        
        loc = c.location.lower()
        area_risk_scores[loc] += 2 if sev == "P1" else 1

    for cl in clusters:
        area_risk_scores[cl.affected_area.lower()] += 5

    most_affected_cat_name = max(category_counts, key=category_counts.get) if category_counts else "Unknown"
    most_affected_category = MostAffectedCategory(
        category=most_affected_cat_name, 
        count=category_counts.get(most_affected_cat_name, 0)
    )

    top_risk_area_name = max(area_risk_scores, key=area_risk_scores.get) if area_risk_scores else "Unknown"
    top_risk_area = TopRiskArea(
        area=top_risk_area_name.title(),
        reason=f"High concentration of critical issues and systemic clusters"
    )

    system_summary = SystemSummary(
        total_complaints=len(complaints),
        critical_issues=severity_counts.get("P1", 0),
        clusters=len(clusters),
        top_risk_area=top_risk_area.area,
        city_health_score=city_health.score
    )

    print("[Category Breakdown]")
    for cat, count in sorted(category_counts.items()):
        print(f"   {cat}: {count}")

    print()
    print("[Severity Distribution]")
    for sev, count in sorted(severity_counts.items()):
        emoji = {"P1": "[!!!]", "P2": "[!!]", "P3": "[!]", "P4": "[-]"}.get(sev, "[?]")
        print(f"   {emoji} {sev}: {count}")

    print()

    result= PipelineResult(
        message="Pipeline executed successfully",
        total_complaints=len(complaints),
        total_clusters=len(clusters),
        complaints=complaints,
        clusters=clusters,
        alerts=alerts,
        predictions=predictions,
        correlations=correlations,
        city_health=city_health,
        top_risk_area=top_risk_area,
        most_affected_category=most_affected_category,
        system_summary=system_summary,
        officer_assignments=assignments,
        execution_log=execution_log,
    )
    return result