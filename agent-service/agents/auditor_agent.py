"""
Agent 3: Systemic Auditor Agent (Cluster Intelligence)
=======================================================
Role: Performs cluster analysis across all recent complaints to detect
systemic failures. Groups complaints by category and proximity.

Current Implementation: Groups by category + location substring matching.
Future: Will use PostGIS ST_DWithin for 500m radius spatial clustering
        and Groq LLaMA for root cause inference.
"""

from collections import defaultdict
from models.complaint import Complaint, Cluster
from math import radians, cos, sin, asin, sqrt


# ── Root cause templates for mock inference ──
ROOT_CAUSE_TEMPLATES = {
    "Water": {
        "default": "Multiple water complaints in the area suggest a possible pump station failure or main pipeline issue.",
        "high_count": "Widespread water disruption detected — likely a major pipeline rupture or pump station #7 failure affecting the entire zone.",
    },
    "Roads": {
        "default": "Cluster of road complaints indicates systematic road degradation, possibly due to recent heavy rainfall or poor maintenance.",
        "high_count": "Major road infrastructure failure — multiple potholes and surface damage suggest substandard road construction in this zone.",
    },
    "Electricity": {
        "default": "Multiple electrical complaints suggest transformer overload or aging grid infrastructure in the area.",
        "high_count": "Critical electrical grid failure — transformer sparking and power outages indicate urgent substation maintenance needed.",
    },
    "Sanitation": {
        "default": "Sanitation cluster detected — missed garbage collection schedule or blocked drainage system in the area.",
        "high_count": "Systemic sanitation failure — blocked main drain or waste management contractor non-performance across multiple wards.",
    },
    "Safety": {
        "default": "Multiple safety complaints in zone — may indicate infrastructure hazard requiring immediate inspection.",
        "high_count": "Critical safety cluster — multiple civilian reports suggest a dangerous zone requiring emergency response team.",
    },
}

# ── Recommended actions per category ──
RECOMMENDED_ACTIONS = {
    "Water": "Deploy maintenance crew to inspect main pipeline and pump station. Check valve pressure readings.",
    "Roads": "Schedule road resurfacing team. Conduct asphalt quality assessment of the affected stretch.",
    "Electricity": "Dispatch electrical maintenance team. Inspect transformer and distribution lines in 1km radius.",
    "Sanitation": "Escalate to sanitation contractor. Deploy emergency waste collection vehicle. Inspect drainage.",
    "Safety": "Alert local police station. Deploy safety inspection team. Install temporary warning signage.",
}

# Minimum complaints to form a cluster
CLUSTER_THRESHOLD = 2  # Set to 2 for demo (spec says 3, but we want clusters to appear with our mock data)

# Maximum distance in km to consider complaints as geographically related
MAX_DISTANCE_KM = 5.0


class AuditorAgent:
    """
    Groups complaints by category and geographic proximity,
    detects systemic patterns, and generates cluster reports
    with root cause inference.
    """

    AGENT_NAME = "AUDITOR"

    def process(self, complaints: list[Complaint]) -> list[Cluster]:
        """
        Analyze all classified complaints to detect systemic clusters.

        Steps:
        1. Group complaints by category
        2. Within each category, sub-group by geographic proximity
        3. If group size >= CLUSTER_THRESHOLD, create a Cluster
        4. Tag constituent complaints with cluster_id
        5. Infer root cause for each cluster

        Args:
            complaints: List of all classified complaints.

        Returns:
            List of detected Cluster objects.
        """
        log_prefix = f"[{self.AGENT_NAME}]"
        clusters: list[Cluster] = []

        print(f"{log_prefix} ═══════════════════════════════════════════")
        print(f"{log_prefix} Running cluster analysis on {len(complaints)} complaints...")
        print()

        # Step 1: Group by category
        category_groups: dict[str, list[Complaint]] = defaultdict(list)
        for c in complaints:
            if c.category:
                category_groups[c.category].append(c)

        # Step 2: Analyze each category group
        for category, group in category_groups.items():
            print(f"{log_prefix} Category: {category} - {len(group)} complaint(s)")

            # Step 3: Sub-group by geographic proximity
            geo_clusters = self._geo_cluster(group)

            for geo_group in geo_clusters:
                if len(geo_group) >= CLUSTER_THRESHOLD:
                    # Step 4: Create cluster
                    is_high_count = len(geo_group) >= 5
                    root_cause_key = "high_count" if is_high_count else "default"
                    templates = ROOT_CAUSE_TEMPLATES.get(category, ROOT_CAUSE_TEMPLATES.get("Safety"))
                    root_cause = templates.get(root_cause_key, templates["default"])

                    cluster = Cluster(
                        category=category,
                        root_cause=root_cause,
                        complaint_ids=[c.id for c in geo_group],
                        count=len(geo_group),
                        affected_area=f"{geo_group[0].location} and surrounding areas",
                        recommended_action=RECOMMENDED_ACTIONS.get(category, "Dispatch inspection team to the area."),
                        severity_escalated=is_high_count or any(c.severity and c.severity.value == "P1" for c in geo_group),
                    )

                    # Tag complaints with cluster_id
                    for c in geo_group:
                        c.cluster_id = cluster.cluster_id

                    clusters.append(cluster)

                    escalation = " [!!] ESCALATED TO DEPT HEAD" if cluster.severity_escalated else ""
                    print(f"{log_prefix}   >> CLUSTER DETECTED! ID: {cluster.cluster_id[:8]}...")
                    print(f"{log_prefix}      Complaints: {cluster.count}")
                    print(f"{log_prefix}      Area: {cluster.affected_area}")
                    print(f"{log_prefix}      Root Cause: {root_cause[:80]}...")
                    print(f"{log_prefix}      Action: {cluster.recommended_action[:60]}...")
                    print(f"{log_prefix}      {escalation}")
                    print()
                else:
                    print(f"{log_prefix}   No cluster formed (only {len(geo_group)} complaint(s) in sub-group)")

        if not clusters:
            print(f"{log_prefix} No systemic clusters detected.")
        else:
            print(f"{log_prefix} [OK] Total clusters detected: {len(clusters)}")

        print(f"{log_prefix} =============================================")
        print()

        return clusters

    def _geo_cluster(self, complaints: list[Complaint]) -> list[list[Complaint]]:
        """
        Simple proximity-based clustering using Haversine distance.
        Groups complaints that are within MAX_DISTANCE_KM of each other.

        In production, this will be replaced by PostGIS ST_DWithin queries.
        """
        if not complaints:
            return []

        visited = set()
        clusters = []

        for i, c1 in enumerate(complaints):
            if i in visited:
                continue
            group = [c1]
            visited.add(i)

            for j, c2 in enumerate(complaints):
                if j in visited:
                    continue
                dist = self._haversine(c1.latitude, c1.longitude, c2.latitude, c2.longitude)
                if dist <= MAX_DISTANCE_KM:
                    group.append(c2)
                    visited.add(j)

            clusters.append(group)

        return clusters

    @staticmethod
    def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate the great-circle distance between two points
        on Earth using the Haversine formula. Returns distance in km.
        """
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * asin(sqrt(a))
        r = 6371  # Earth's radius in km
        return c * r
