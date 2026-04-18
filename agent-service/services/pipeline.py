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
from models.complaint import Complaint, Cluster, PipelineResult, Alert, SeverityLevel, Prediction, PredictiveAlert, Correlation, CityHealth, TopRiskArea, MostAffectedCategory, SystemSummary
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


# ── Severity weights for velocity computation ──
SEVERITY_VELOCITY_WEIGHTS = {
    SeverityLevel.P1: 3.0,
    SeverityLevel.P2: 2.0,
    SeverityLevel.P3: 1.0,
    SeverityLevel.P4: 0.5,
}


def generate_predictive_alerts(complaints: list[Complaint], clusters: list[Cluster]) -> list[PredictiveAlert]:
    """
    Predict infrastructure failures 24-48 hours ahead using cluster velocity.
    
    Velocity = weighted_complaint_count / time_span_hours
    Thresholds:
      - velocity >= 2.0/hr → 24hr critical alert
      - velocity >= 1.0/hr → 48hr warning alert
      - velocity >= 0.5/hr with P1 present → 24hr elevated alert
    """
    alerts: list[PredictiveAlert] = []
    
    # Group complaints by category
    category_groups: dict[str, list[Complaint]] = defaultdict(list)
    for c in complaints:
        if c.category:
            category_groups[c.category].append(c)
    
    # Map clusters to categories for area info
    cluster_areas: dict[str, str] = {}
    for cl in clusters:
        cluster_areas[cl.category] = cl.affected_area
    
    for category, group in category_groups.items():
        if len(group) < 2:
            continue
        
        # Calculate time span from earliest to latest complaint
        timestamps = []
        for c in group:
            try:
                timestamps.append(datetime.fromisoformat(c.created_at))
            except (ValueError, TypeError):
                timestamps.append(datetime.utcnow())
        
        if len(timestamps) < 2:
            continue
            
        time_span_hours = max(
            (max(timestamps) - min(timestamps)).total_seconds() / 3600,
            0.5  # Minimum 30 min span to avoid division artifacts
        )
        
        # Compute weighted count (P1 counts 3x, P2 counts 2x, etc.)
        weighted_count = sum(
            SEVERITY_VELOCITY_WEIGHTS.get(c.severity, 1.0)
            for c in group
        )
        
        velocity = weighted_count / time_span_hours
        
        # Check for P1 presence in this category
        has_p1 = any(c.severity == SeverityLevel.P1 for c in group)
        
        # Determine alert level
        time_horizon = 0
        confidence = "low"
        
        if velocity >= 2.0:
            time_horizon = 24
            confidence = "high"
        elif velocity >= 1.0:
            time_horizon = 48
            confidence = "medium"
        elif velocity >= 0.5 and has_p1:
            time_horizon = 24
            confidence = "medium"
        
        if time_horizon > 0:
            trigger_parts = []
            trigger_parts.append(f"{len(group)} complaints at velocity {velocity:.1f}/hr")
            if has_p1:
                trigger_parts.append("P1 severity detected")
            if category in cluster_areas:
                trigger_parts.append(f"active cluster in {cluster_areas[category]}")
            
            alerts.append(PredictiveAlert(
                category=category,
                predicted_failure=f"{category} infrastructure failure predicted within {time_horizon} hours",
                time_horizon_hours=time_horizon,
                confidence=confidence,
                velocity_score=round(velocity, 2),
                trigger_reason="; ".join(trigger_parts),
                affected_area=cluster_areas.get(category),
                severity_weight=round(weighted_count, 1),
            ))
    
    # Sort by velocity (most urgent first)
    alerts.sort(key=lambda a: a.velocity_score, reverse=True)
    return alerts


# ── Cross-department correlation patterns ──
CROSS_DEPT_PATTERNS = {
    frozenset({"Water", "Electricity"}): {
        "correlation_type": "construction_damage",
        "likely_root_cause": "Construction or excavation work has likely damaged both water pipes and electrical conduits running underground.",
        "recommended_joint_action": "Deploy joint Water + Electricity inspection team. Check for active construction sites within 500m radius.",
    },
    frozenset({"Water", "Roads"}): {
        "correlation_type": "shared_infrastructure",
        "likely_root_cause": "Underground water pipeline damage has likely caused road surface collapse or subsidence.",
        "recommended_joint_action": "Inspect subsurface water mains before road resurfacing. Coordinate pipeline repair with road crew.",
    },
    frozenset({"Electricity", "Safety"}): {
        "correlation_type": "cascading_failure",
        "likely_root_cause": "Electrical infrastructure failure (downed wires, transformer damage) creating public safety hazard.",
        "recommended_joint_action": "Cordon off affected area immediately. Deploy electrical emergency team with safety escort.",
    },
    frozenset({"Sanitation", "Water"}): {
        "correlation_type": "shared_infrastructure",
        "likely_root_cause": "Blocked drainage system causing sewage backflow and contaminating water supply lines.",
        "recommended_joint_action": "Priority drain clearance + water quality testing in affected zone.",
    },
    frozenset({"Roads", "Safety"}): {
        "correlation_type": "cascading_failure",
        "likely_root_cause": "Deteriorated road conditions (potholes, missing signage) creating accident-prone zones.",
        "recommended_joint_action": "Emergency pothole filling + temporary safety barriers. Schedule road safety audit.",
    },
    frozenset({"Sanitation", "Safety"}): {
        "correlation_type": "cascading_failure",
        "likely_root_cause": "Waste accumulation and drain overflow creating health and safety hazards for residents.",
        "recommended_joint_action": "Emergency waste clearance + health inspection of affected area.",
    },
}


def detect_cross_dept_correlations(complaints: list[Complaint]) -> list[Correlation]:
    """
    Detect cross-department correlations by grouping complaints
    by geographic proximity and finding locations with multiple
    department categories. Uses predefined patterns for known
    cross-department failure modes.
    """
    from math import radians, cos, sin, asin, sqrt
    
    correlations = []
    
    # Group complaints by proximity (within ~2km)
    # Build location buckets using normalized location names
    location_groups: dict[str, list[Complaint]] = defaultdict(list)
    for c in complaints:
        if c.location and c.category:
            loc_key = c.location.strip().lower()
            location_groups[loc_key].append(c)
    
    # Also merge nearby GPS coordinates into groups
    processed_locs = list(location_groups.keys())
    merged: dict[str, set[str]] = {loc: {loc} for loc in processed_locs}
    
    for i, loc1 in enumerate(processed_locs):
        group1 = location_groups[loc1]
        if not group1:
            continue
        c1 = group1[0]
        for j, loc2 in enumerate(processed_locs):
            if j <= i:
                continue
            group2 = location_groups[loc2]
            if not group2:
                continue
            c2 = group2[0]
            # Haversine distance check (~2km)
            lat1, lon1, lat2, lon2 = map(radians, [c1.latitude, c1.longitude, c2.latitude, c2.longitude])
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
            dist = 2 * asin(sqrt(a)) * 6371  # km
            if dist <= 2.0:
                # Merge loc2 into loc1's group
                for key in merged.get(loc2, {loc2}):
                    merged.setdefault(loc1, {loc1}).add(key)
                merged[loc2] = merged[loc1]  # point to same set
    
    # Deduplicate merged groups
    seen_groups: list[set[str]] = []
    seen_locs: set[str] = set()
    for loc, group_set in merged.items():
        frozen = frozenset(group_set)
        if frozen not in seen_locs:
            seen_groups.append(group_set)
            seen_locs.add(frozen)
    
    # Analyze each location group for cross-department patterns
    for loc_set in seen_groups:
        # Collect all complaints in this location group
        all_complaints: list[Complaint] = []
        for loc_key in loc_set:
            all_complaints.extend(location_groups.get(loc_key, []))
        
        if not all_complaints:
            continue
        
        # Get unique categories
        categories = set(c.category for c in all_complaints if c.category)
        
        if len(categories) < 2:
            continue
        
        # Check all pairs of categories for known patterns
        cat_list = sorted(categories)
        location_display = all_complaints[0].location.title()
        
        for ci in range(len(cat_list)):
            for cj in range(ci + 1, len(cat_list)):
                pair = frozenset({cat_list[ci], cat_list[cj]})
                pattern = CROSS_DEPT_PATTERNS.get(pair)
                
                if pattern:
                    # Known cross-dept pattern found
                    correlations.append(Correlation(
                        location=location_display,
                        correlation=f"{cat_list[ci]} issues linked to {cat_list[cj]} complaints",
                        departments=[cat_list[ci], cat_list[cj]],
                        reason=f"{len(all_complaints)} complaints across {len(categories)} departments in same area",
                        correlation_type=pattern["correlation_type"],
                        confidence="high",
                        likely_root_cause=pattern["likely_root_cause"],
                        recommended_joint_action=pattern["recommended_joint_action"],
                    ))
                else:
                    # Unknown pair — still flag it
                    correlations.append(Correlation(
                        location=location_display,
                        correlation=f"{cat_list[ci]} and {cat_list[cj]} issues detected in same region",
                        departments=[cat_list[ci], cat_list[cj]],
                        reason=f"Multiple categories ({len(categories)}) detected in proximity",
                        correlation_type="unknown",
                        confidence="medium",
                        likely_root_cause=f"Possible shared infrastructure or cascading failure between {cat_list[ci]} and {cat_list[cj]}.",
                        recommended_joint_action=f"Joint inspection by {cat_list[ci]} and {cat_list[cj]} departments recommended.",
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

    # Predictive Failure Alerts (24-48hr look-ahead)
    predictive_alerts = generate_predictive_alerts(complaints, clusters)
    for pa in predictive_alerts:
        execution_log.append(f"[PREDICTIVE ALERT] {pa.category}: {pa.predicted_failure} (velocity={pa.velocity_score}/hr, horizon={pa.time_horizon_hours}h, confidence={pa.confidence})")
        print(f"[PREDICTIVE ALERT] {pa.category}: {pa.predicted_failure}")
        print(f"                   Velocity={pa.velocity_score}/hr | Horizon={pa.time_horizon_hours}h | Confidence={pa.confidence}")
        # Also create a pipeline Alert for predictive alerts
        alerts.append(Alert(
            type="PREDICTIVE_ALERT",
            message=pa.predicted_failure,
            severity="HIGH" if pa.time_horizon_hours == 24 else "MEDIUM",
            area=pa.affected_area,
        ))

    # Cross-Department Correlations
    correlations = detect_cross_dept_correlations(complaints)
    for c in correlations:
        corr_type = c.correlation_type or "unknown"
        execution_log.append(f"[CORRELATION] [{corr_type.upper()}] Multi-department issue in {c.location}: {c.departments}")
        print(f"[CORRELATION] [{corr_type.upper()}] {c.location}: {c.departments}")
        if c.likely_root_cause:
            print(f"              Root Cause: {c.likely_root_cause[:80]}...")
        if c.recommended_joint_action:
            print(f"              Action: {c.recommended_joint_action[:80]}...")

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
        predictive_alerts=predictive_alerts,
        correlations=correlations,
        city_health=city_health,
        top_risk_area=top_risk_area,
        most_affected_category=most_affected_category,
        system_summary=system_summary,
        officer_assignments=assignments,
        execution_log=execution_log,
    )
    return result