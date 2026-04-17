"""
Agent 2: Priority Logic Agent (Impact Matrix Engine)
=====================================================
Role: Classifies each complaint by category and computes a dynamic
priority score using the Impact Matrix formula.

Priority Score = (Severity Weight × Location Multiplier × Affected Population)
                 / (1 + Hours_Since_Submission × 0.1)

Severity Weights:  P1=100, P2=70, P3=40, P4=10
Location Multipliers: School/Hospital=3.0, Commercial=2.5, Residential=2.0, Park=1.0
"""

from datetime import datetime
from models.complaint import Complaint, SeverityLevel, ComplaintStatus
from services.llm_service import analyze_with_llm


# ── Keyword-based category classification rules ──
CATEGORY_KEYWORDS = {
    "Water": ["water", "pipeline", "tap", "supply", "pressure", "leak", "burst", "pump"],
    "Roads": ["road", "pothole", "crack", "broken road", "surface", "highway", "flyover"],
    "Electricity": ["electric", "wire", "transformer", "power", "streetlight", "light out", "sparking", "voltage"],
    "Sanitation": ["garbage", "waste", "sewage", "drain", "stench", "trash", "dump", "overflow"],
    "Safety": ["unsafe", "crime", "theft", "fire", "accident", "dangerous", "harassment"],
}

# ── Critical keywords that trigger P1 severity ──
P1_CRITICAL_KEYWORDS = ["live wire", "fire", "sparking", "collapse", "flood", "accident", "children", "school", "hospital", "risk"]
P2_HIGH_KEYWORDS = ["burst", "overflow", "no supply", "dark", "unsafe", "women"]

# ── Sentiment and high distress keywords ──
HIGH_DISTRESS_KEYWORDS = ["urgent", "danger", "help", "fire", "shock"]

# ── Location type detection for zone multiplier ──
ZONE_KEYWORDS = {
    "school": ["school", "college", "university", "jntu", "campus"],
    "hospital": ["hospital", "clinic", "medical", "health"],
    "commercial": ["hitech", "cyber", "mall", "market", "shop"],
    "residential": ["colony", "apartment", "flat", "residential", "society"],
    "park": ["park", "garden", "playground", "ground"],
}

ZONE_MULTIPLIERS = {
    "school": 3.0,
    "hospital": 3.0,
    "commercial": 2.5,
    "residential": 2.0,
    "park": 1.0,
}

SEVERITY_WEIGHTS = {
    SeverityLevel.P1: 100,
    SeverityLevel.P2: 70,
    SeverityLevel.P3: 40,
    SeverityLevel.P4: 10,
}

SLA_HOURS = {
    SeverityLevel.P1: 2,
    SeverityLevel.P2: 8,
    SeverityLevel.P3: 24,
    SeverityLevel.P4: 72,
}


class PriorityAgent:
    """
    Classifies complaints into categories, assigns severity levels,
    detects zone types, and computes the Impact Matrix priority score.
    """

    AGENT_NAME = "PRIORITY"

    def process(self, complaint: Complaint) -> Complaint:
        """
        Enrich a complaint with category, severity, zone type, and priority score.

        Args:
            complaint: Ingested complaint with normalized_text.

        Returns:
            Complaint with category, severity, zone_type, priority_score,
            and sla_deadline_hours populated.
        """
        log_prefix = f"[{self.AGENT_NAME}]"
        text_lower = (complaint.normalized_text or complaint.text).lower()
        location_lower = complaint.location.lower()

        # ── Step 1: Detect zone type ──
        complaint.zone_type = self._detect_zone(text_lower, location_lower)

        # ── Step 2: LLM Classification ──
        prompt = f"""
Analyze the following civic complaint and classify it.
Return ONLY a valid JSON object matching this schema exactly:
{{
  "category": "<Must be one of: Water, Roads, Electricity, Sanitation, Safety, Other>",
  "severity": "<Must be one of: P1, P2, P3, P4> (P1 is life-threatening/critical, P4 is low)",
  "reason": "<A brief one-sentence reasoning for the classification>"
}}

Complaint: "{text_lower}"
"""
        llm_data = analyze_with_llm(prompt)
        
        if llm_data and "category" in llm_data and "severity" in llm_data:
            complaint.category = llm_data["category"]
            sev_raw = llm_data["severity"]
            complaint.severity = SeverityLevel(sev_raw) if sev_raw in ["P1", "P2", "P3", "P4"] else SeverityLevel.P3
            
            if any(kw in text_lower for kw in HIGH_DISTRESS_KEYWORDS):
                complaint.sentiment = "high_distress"
                complaint.severity = SeverityLevel.P1
                
            reason_msg = llm_data.get('reason', 'Classified via Groq LLM.').replace('[LLM]', '').strip()
            if complaint.sentiment == "high_distress":
                reason_msg += " Elevated severity due to high distress keywords."
            complaint.reason = reason_msg
        else:
            # ── Fallback logic ──
            complaint.category = self._classify_category(text_lower)

            if any(kw in text_lower for kw in HIGH_DISTRESS_KEYWORDS):
                complaint.sentiment = "high_distress"
            
            complaint.severity = self._assign_severity(text_lower)

            reason_msg = f"Detected category '{complaint.category}' based on text analysis."
            if complaint.sentiment == "high_distress":
                reason_msg += " Elevated severity due to high distress keywords."
            complaint.reason = reason_msg

        # ── Step 3: Compute priority score ──
        complaint.priority_score = self._compute_priority_score(complaint)

        # ── Step 4: Set SLA deadline ──
        complaint.sla_deadline_hours = SLA_HOURS.get(complaint.severity, 72)

        # ── Step 5: Update status ──
        complaint.status = ComplaintStatus.CLASSIFIED
        complaint.updated_at = datetime.utcnow().isoformat()

        # ── Step 6: Record agent notes ──
        complaint.agent_notes["priority"] = {
            "category": complaint.category,
            "severity": complaint.severity.value,
            "zone_type": complaint.zone_type,
            "priority_score": round(complaint.priority_score, 2),
            "sla_hours": complaint.sla_deadline_hours,
            "classified_at": complaint.updated_at,
            "sentiment": complaint.sentiment,
            "reason": reason_msg
        }

        # ── Logging ──
        print(f"{log_prefix} Category={complaint.category} | Severity={complaint.severity.value} | Reason={reason_msg}")
        print()

        return complaint

    def _classify_category(self, text: str) -> str:
        """Match complaint text against category keyword lists."""
        scores = {}
        for category, keywords in CATEGORY_KEYWORDS.items():
            score = sum(1 for kw in keywords if kw in text)
            if score > 0:
                scores[category] = score

        if not scores:
            return "Other"

        # Return category with most keyword matches
        return max(scores, key=scores.get)

    def _detect_zone(self, text: str, location: str) -> str:
        """Detect the zone type from text and location for multiplier."""
        combined = f"{text} {location}"
        for zone, keywords in ZONE_KEYWORDS.items():
            if any(kw in combined for kw in keywords):
                return zone
        return "residential"  # Default assumption

    def _assign_severity(self, text: str) -> SeverityLevel:
        """Assign severity level based on critical keyword matching."""
        # Note: High distress keywords are handled here or by sentiment logic.
        if any(kw in text for kw in HIGH_DISTRESS_KEYWORDS):
            return SeverityLevel.P1
        if any(kw in text for kw in P1_CRITICAL_KEYWORDS):
            return SeverityLevel.P1
        if any(kw in text for kw in P2_HIGH_KEYWORDS):
            return SeverityLevel.P2
        return SeverityLevel.P3

    def _compute_priority_score(self, complaint: Complaint) -> float:
        """
        Impact Matrix Formula:
        Score = (Severity Weight × Zone Multiplier × Affected Population)
                / (1 + Hours_Since_Submission × 0.1)

        For mock: affected_population = 1 (will be cluster count in production)
        """
        severity_weight = SEVERITY_WEIGHTS.get(complaint.severity, 10)
        zone_multiplier = ZONE_MULTIPLIERS.get(complaint.zone_type, 1.0)
        affected_population = 1  # Will come from cluster analysis later

        # Time decay: for mock, assume just submitted (0 hours)
        hours_since = 0
        time_decay = 1 + (hours_since * 0.1)

        score = (severity_weight * zone_multiplier * affected_population) / time_decay
        return score
