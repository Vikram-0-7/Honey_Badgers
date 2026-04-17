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
from models.complaint import Complaint, Cluster, PipelineResult
from services.mock_data import generate_mock_complaints


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
        execution_log.append(f"Ingestion: {complaint.id[:8]} — {complaint.source.value}")

        # Agent 2: Priority
        complaint = priority_agent.process(complaint)
        execution_log.append(
            f"Priority: {complaint.id[:8]} — {complaint.category} / "
            f"{complaint.severity.value} / Score: {complaint.priority_score:.1f}"
        )

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

    # ── Category breakdown ──
    category_counts: dict[str, int] = {}
    severity_counts: dict[str, int] = {}
    for c in complaints:
        cat = c.category or "Unknown"
        category_counts[cat] = category_counts.get(cat, 0) + 1
        sev = c.severity.value if c.severity else "Unclassified"
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

    print("[Category Breakdown]")
    for cat, count in sorted(category_counts.items()):
        print(f"   {cat}: {count}")

    print()
    print("[Severity Distribution]")
    for sev, count in sorted(severity_counts.items()):
        emoji = {"P1": "[!!!]", "P2": "[!!]", "P3": "[!]", "P4": "[-]"}.get(sev, "[?]")
        print(f"   {emoji} {sev}: {count}")

    print()

    return PipelineResult(
        message="Pipeline executed successfully",
        total_complaints=len(complaints),
        total_clusters=len(clusters),
        complaints=complaints,
        clusters=clusters,
        officer_assignments=assignments,
        execution_log=execution_log,
    )
