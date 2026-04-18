"""
Pydantic models for Civix-Pulse complaint data structures.
These models define the shape of data flowing through the agent pipeline.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import uuid4
from datetime import datetime
from enum import Enum


class Alert(BaseModel):
    """Alert for critical incidents or systemic clusters."""
    type: str = Field(..., description="CRITICAL_ALERT or CLUSTER_ALERT")
    message: str
    severity: Optional[str] = None
    area: Optional[str] = None
    complaint_id: Optional[str] = None
    cluster_id: Optional[str] = None


class TopRiskArea(BaseModel):
    area: str
    reason: str


class MostAffectedCategory(BaseModel):
    category: str
    count: int


class SystemSummary(BaseModel):
    total_complaints: int
    critical_issues: int
    clusters: int
    top_risk_area: str
    city_health_score: int


class Prediction(BaseModel):
    category: str
    prediction: str
    trend: str
    confidence: str


class PredictiveAlert(BaseModel):
    """Velocity-based predictive failure alert (24-48hr look-ahead)."""
    category: str
    predicted_failure: str
    time_horizon_hours: int = Field(description="24 or 48 — how far ahead the prediction looks")
    confidence: str = Field(description="high, medium, or low")
    velocity_score: float = Field(description="Complaints per hour rate")
    trigger_reason: str
    affected_area: Optional[str] = None
    severity_weight: float = Field(default=0.0, description="Weighted severity score of contributing complaints")


class Correlation(BaseModel):
    location: str
    correlation: str
    departments: List[str]
    reason: str
    correlation_type: Optional[str] = Field(default=None, description="construction_damage | shared_infrastructure | cascading_failure")
    confidence: Optional[str] = Field(default=None, description="high, medium, or low")
    likely_root_cause: Optional[str] = Field(default=None)
    recommended_joint_action: Optional[str] = Field(default=None)


class CityHealth(BaseModel):
    score: int
    status: str


class SeverityLevel(str, Enum):
    """Priority severity levels — P1 is most critical."""
    P1 = "P1"  # Critical: life-threatening or safety hazard
    P2 = "P2"  # High: significant disruption
    P3 = "P3"  # Medium: moderate inconvenience
    P4 = "P4"  # Low: minor issue


class ComplaintStatus(str, Enum):
    """Lifecycle status of a complaint."""
    PENDING = "pending"
    CLASSIFIED = "classified"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    VERIFIED_CLOSED = "verified_closed"


class ComplaintSource(str, Enum):
    """Channel through which the complaint was received."""
    PORTAL = "portal"
    WHATSAPP = "whatsapp"
    VOICE = "voice"
    OCR = "ocr"
    TWITTER = "twitter"


class Complaint(BaseModel):
    """
    Core complaint model that flows through the entire agent pipeline.
    Each agent enriches this model with additional fields.
    """
    id: str = Field(default_factory=lambda: str(uuid4()))
    text: str = Field(..., description="Raw complaint text from citizen")
    location: str = Field(..., description="Location name or address")
    latitude: float = Field(default=17.385, description="GPS latitude")
    longitude: float = Field(default=78.4867, description="GPS longitude")
    source: ComplaintSource = Field(default=ComplaintSource.PORTAL)
    citizen_id: Optional[str] = Field(default=None)

    # Fields populated by Ingestion Agent
    normalized_text: Optional[str] = Field(default=None)
    ingested_at: Optional[str] = Field(default=None)

    # Fields populated by Priority Agent
    category: Optional[str] = Field(default=None)
    priority_score: Optional[float] = Field(default=None)
    severity: Optional[SeverityLevel] = Field(default=None)
    zone_type: Optional[str] = Field(default=None, description="school | hospital | residential | commercial | park")

    # Fields populated by Auditor Agent
    cluster_id: Optional[str] = Field(default=None)

    # Fields populated by Resolver Agent
    officer_id: Optional[str] = Field(default=None)
    officer_name: Optional[str] = Field(default=None)
    department: Optional[str] = Field(default=None)
    sla_deadline_hours: Optional[int] = Field(default=None)

    # General status
    status: ComplaintStatus = Field(default=ComplaintStatus.PENDING)
    sentiment: Optional[str] = Field(default=None)
    assigned_at: Optional[str] = Field(default=None)
    sla_status: Optional[str] = Field(default=None, description="on_time or breach")
    reason: Optional[str] = Field(default=None, description="Explanation for agent logic")
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: Optional[str] = Field(default=None)

    # Verification fields (for citizen verification loop)
    verification_photo_url: Optional[str] = Field(default=None)
    verification_status: Optional[str] = Field(default=None, description="verified | reopened")
    verification_feedback: Optional[str] = Field(default=None)
    agent_notes: dict = Field(default_factory=dict)


class Cluster(BaseModel):
    """
    Represents a group of spatially and categorically related complaints
    that likely share a common root cause.
    """
    cluster_id: str = Field(default_factory=lambda: str(uuid4()))
    category: str
    root_cause: str
    complaint_ids: List[str]
    count: int
    affected_area: str = Field(description="Description of the affected geographic area")
    recommended_action: str
    insight: Optional[str] = Field(default=None)
    predicted_issue: Optional[str] = Field(default=None)
    confidence: Optional[str] = Field(default=None)
    reason: Optional[str] = Field(default=None)
    severity_escalated: bool = Field(default=False)
    status: str = Field(default="active")
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class Officer(BaseModel):
    """Mock field officer for task assignment."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    department: str
    phone: str
    status: str = Field(default="available")  # available | assigned | offline
    current_task_id: Optional[str] = Field(default=None)
    completed_tasks: List[str] = Field(default_factory=list)
    avg_resolution_time_hrs: float = Field(default=0.0)


class PipelineResult(BaseModel):
    """Final output from a complete pipeline run."""
    message: str
    pipeline_run_id: str = Field(default_factory=lambda: str(uuid4()))
    total_complaints: int
    total_clusters: int
    complaints: List[Complaint]
    clusters: List[Cluster]
    alerts: List[Alert] = Field(default_factory=list)
    predictions: List[Prediction] = Field(default_factory=list)
    predictive_alerts: List[PredictiveAlert] = Field(default_factory=list)
    correlations: List[Correlation] = Field(default_factory=list)
    city_health: Optional[CityHealth] = None
    top_risk_area: Optional[TopRiskArea] = None
    most_affected_category: Optional[MostAffectedCategory] = None
    system_summary: Optional[SystemSummary] = None
    officer_assignments: List[dict]
    execution_log: List[str]
