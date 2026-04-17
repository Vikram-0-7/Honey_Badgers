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
            "text": "Low water pressure in Kukatpally for the last 3 days. We can barely fill a bucket.",
            "location": "Kukatpally",
            "latitude": 17.4947,
            "longitude": 78.3996,
            "source": ComplaintSource.PORTAL,
        },
        {
            "text": "Live wire dangling near St. Mary's School gate. Children are at risk!",
            "location": "Secunderabad, near St. Mary's School",
            "latitude": 17.4399,
            "longitude": 78.4983,
            "source": ComplaintSource.WHATSAPP,
        },
        {
            "text": "Massive pothole on Jubilee Hills Road No. 10. Two accidents this week.",
            "location": "Jubilee Hills Road No. 10",
            "latitude": 17.4319,
            "longitude": 78.4072,
            "source": ComplaintSource.PORTAL,
        },
        {
            "text": "No water supply in Miyapur since yesterday morning. Entire colony affected.",
            "location": "Miyapur",
            "latitude": 17.4969,
            "longitude": 78.3548,
            "source": ComplaintSource.VOICE,
        },
        {
            "text": "Garbage not collected in Ameerpet for 5 days. Stench is unbearable.",
            "location": "Ameerpet",
            "latitude": 17.4375,
            "longitude": 78.4483,
            "source": ComplaintSource.PORTAL,
        },
        {
            "text": "Streetlight out on Madhapur main road near Hitech City. Very dark at night, unsafe for women.",
            "location": "Madhapur, Hitech City",
            "latitude": 17.4486,
            "longitude": 78.3908,
            "source": ComplaintSource.TWITTER,
        },
        {
            "text": "Water pipeline burst near Kukatpally bus stop. Water flooding the road.",
            "location": "Kukatpally Bus Stop",
            "latitude": 17.4935,
            "longitude": 78.3980,
            "source": ComplaintSource.WHATSAPP,
        },
        {
            "text": "Open drain overflowing in Begumpet near the hospital. Sewage on the main road.",
            "location": "Begumpet, near hospital",
            "latitude": 17.4440,
            "longitude": 78.4674,
            "source": ComplaintSource.PORTAL,
        },
        {
            "text": "Broken road surface on JNTU-Kukatpally stretch. Water leaking from underground pipe.",
            "location": "JNTU Kukatpally",
            "latitude": 17.4932,
            "longitude": 78.3914,
            "source": ComplaintSource.VOICE,
        },
        {
            "text": "Electricity transformer sparking dangerously in Kondapur residential area. Fire risk!",
            "location": "Kondapur",
            "latitude": 17.4578,
            "longitude": 78.3570,
            "source": ComplaintSource.WHATSAPP,
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
