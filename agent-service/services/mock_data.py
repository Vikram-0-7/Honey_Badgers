"""
Mock data generator for Civix-Pulse demo.
Generates realistic Hyderabad-based complaints and field officers
for testing the agent pipeline without any database.
"""

from models.complaint import Complaint, Officer, ComplaintSource


def generate_mock_complaints() -> list[Complaint]:
    """
    Generate 10 realistic mock complaints across Hyderabad neighborhoods.
    These simulate real-world citizen grievances covering multiple categories.
    """
    raw_complaints = [
    ]

    return [Complaint(**data) for data in raw_complaints]


def generate_mock_officers() -> list[Officer]:
    """
    Generate mock field officers, one per department,
    for task assignment simulation.
    """
    officers = [
        Officer(
            name="Ravi Kumar",
            department="Water",
            phone="+91-9876543210",
            status="available",
        ),
        Officer(
            name="Priya Sharma",
            department="Roads",
            phone="+91-9876543211",
            status="available",
        ),
        Officer(
            name="Suresh Reddy",
            department="Electricity",
            phone="+91-9876543212",
            status="available",
        ),
        Officer(
            name="Anjali Deshmukh",
            department="Sanitation",
            phone="+91-9876543213",
            status="available",
        ),
        Officer(
            name="Vikram Singh",
            department="Safety",
            phone="+91-9876543214",
            status="available",
        ),
    ]
    return officers
