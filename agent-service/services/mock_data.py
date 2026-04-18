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
        {
            "text": "Major water pipeline burst flooding the road near JNTU campus, children walking through dirty water",
            "location": "Kukatpally",
            "latitude": 17.4947,
            "longitude": 78.3996,
            "source": "portal",
        },
        {
            "text": "No water supply since yesterday morning, overhead tank completely dry",
            "location": "Kukatpally",
            "latitude": 17.4950,
            "longitude": 78.4000,
            "source": "whatsapp",
        },
        {
            "text": "Water leaking from underground pipe near main road junction causing traffic issues",
            "location": "Kukatpally",
            "latitude": 17.4943,
            "longitude": 78.3992,
            "source": "portal",
        },
        {
            "text": "Electrical transformer sparking dangerously near residential colony, risk of fire",
            "location": "Kukatpally",
            "latitude": 17.4945,
            "longitude": 78.3998,
            "source": "portal",
        },
        {
            "text": "Power outage for 3 days in entire ward, no response from electricity board",
            "location": "Kukatpally",
            "latitude": 17.4952,
            "longitude": 78.4005,
            "source": "voice",
        },
        {
            "text": "Massive pothole on highway causing accidents, two wheeler fell yesterday",
            "location": "Gachibowli",
            "latitude": 17.4401,
            "longitude": 78.3489,
            "source": "twitter",
        },
        {
            "text": "Garbage dump overflowing near hospital entrance creating health hazard and stench",
            "location": "Ameerpet",
            "latitude": 17.4375,
            "longitude": 78.4482,
            "source": "portal",
        },
        {
            "text": "Sewage drain blocked and overflowing into residential streets, unsafe for walking",
            "location": "Ameerpet",
            "latitude": 17.4380,
            "longitude": 78.4488,
            "source": "whatsapp",
        },
        {
            "text": "Streetlights not working on main road near school, very dark and unsafe at night",
            "location": "Gachibowli",
            "latitude": 17.4410,
            "longitude": 78.3495,
            "source": "portal",
        },
        {
            "text": "Live wire hanging dangerously low near children's park, urgent danger",
            "location": "Gachibowli",
            "latitude": 17.4405,
            "longitude": 78.3492,
            "source": "portal",
        },
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
