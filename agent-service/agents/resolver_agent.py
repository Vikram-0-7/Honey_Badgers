"""
Agent 4: Resolution Workflow Agent (Task Orchestrator)
=======================================================
Role: Assigns tasks to available field officers based on department match,
tracks SLA deadlines, and manages the assignment workflow.

Current Implementation: Mock officer assignment by department.
Future: Will integrate Supabase officer queries, SLA timer with cron jobs,
        citizen verification flow, and notification engine.
"""

from datetime import datetime
from models.complaint import Complaint, ComplaintStatus, Officer


# ── Department-to-Officer mapping for mock data ──
# In production, this will query Supabase for nearest available officer
DEPARTMENT_OFFICER_MAP = {
    "Water": {"name": "Ravi Kumar", "id": "officer-water-001"},
    "Roads": {"name": "Priya Sharma", "id": "officer-roads-002"},
    "Electricity": {"name": "Suresh Reddy", "id": "officer-electricity-003"},
    "Sanitation": {"name": "Anjali Deshmukh", "id": "officer-sanitation-004"},
    "Safety": {"name": "Vikram Singh", "id": "officer-safety-005"},
    "Other": {"name": "Vikram Singh", "id": "officer-safety-005"},  # Fallback
}

SLA_HOURS = {
    "P1": 2,
    "P2": 8,
    "P3": 24,
    "P4": 72,
}


class ResolverAgent:
    """
    Assigns complaints to the correct field officer,
    sets SLA deadlines, and updates complaint status.
    """

    AGENT_NAME = "RESOLVER"

    def process(self, complaint: Complaint) -> dict:
        """
        Assign a single complaint to the appropriate field officer.

        Steps:
        1. Look up officer by complaint category (department match)
        2. Assign officer to complaint
        3. Set SLA deadline based on severity
        4. Update complaint status to ASSIGNED
        5. Return assignment record

        Args:
            complaint: Classified complaint with category and severity.

        Returns:
            Dictionary with assignment details (officer, SLA, complaint).
        """
        log_prefix = f"[{self.AGENT_NAME}]"

        # Step 1: Find the right officer for this department
        category = complaint.category or "Other"
        officer_info = DEPARTMENT_OFFICER_MAP.get(category, DEPARTMENT_OFFICER_MAP["Other"])

        # Step 2: Assign officer to complaint
        complaint.officer_id = officer_info["id"]
        complaint.officer_name = officer_info["name"]
        complaint.department = category

        # Step 3: Set SLA deadline
        severity_val = complaint.severity.value if complaint.severity else "P4"
        complaint.sla_deadline_hours = SLA_HOURS.get(severity_val, 72)

        # Step 4: Update status and SLA tracking
        complaint.status = ComplaintStatus.ASSIGNED
        complaint.assigned_at = datetime.utcnow().isoformat()
        complaint.updated_at = complaint.assigned_at
        complaint.sla_status = "on_time"
        
        reason_msg = f"Assigned to {officer_info['name']} based on department ({category}) availability."
        if complaint.reason:
            complaint.reason += " -> " + reason_msg
        else:
            complaint.reason = reason_msg

        # Step 5: Record agent notes
        complaint.agent_notes["resolver"] = {
            "officer_id": complaint.officer_id,
            "officer_name": complaint.officer_name,
            "department": complaint.department,
            "sla_deadline_hours": complaint.sla_deadline_hours,
            "assigned_at": complaint.updated_at,
            "verification_pending": True,
        }

        # Build assignment record
        assignment = {
            "complaint_id": complaint.id,
            "complaint_summary": complaint.text[:60],
            "category": category,
            "severity": severity_val,
            "officer_id": complaint.officer_id,
            "officer_name": complaint.officer_name,
            "sla_deadline_hours": complaint.sla_deadline_hours,
            "assigned_at": complaint.updated_at,
            "status": "assigned",
        }

        # Logging
        urgency = "[URGENT]" if severity_val == "P1" else "[STANDARD]"
        print(f"{log_prefix} Assigned to {officer_info['name']} | SLA Deadline={complaint.sla_deadline_hours}h | Urgency={urgency}")
        print()

        return assignment

    def process_batch(self, complaints: list[Complaint]) -> list[dict]:
        """
        Assign officers to all complaints in a batch.

        Args:
            complaints: List of classified complaints.

        Returns:
            List of assignment records.
        """
        log_prefix = f"[{self.AGENT_NAME}]"
        print(f"{log_prefix} =============================================")
        print(f"{log_prefix} Assigning {len(complaints)} complaints to field officers...")
        print()

        assignments = []
        for complaint in complaints:
            assignment = self.process(complaint)
            assignments.append(assignment)

        # Summary
        print(f"{log_prefix} ---------------------------------------------")
        print(f"{log_prefix} [OK] All {len(assignments)} complaints assigned!")

        # Officer workload summary
        officer_load: dict[str, int] = {}
        for a in assignments:
            name = a["officer_name"]
            officer_load[name] = officer_load.get(name, 0) + 1

        print(f"{log_prefix} Officer workload:")
        for name, count in sorted(officer_load.items(), key=lambda x: -x[1]):
            print(f"{log_prefix}   {name}: {count} task(s)")

        print(f"{log_prefix} =============================================")
        print()

        return assignments
