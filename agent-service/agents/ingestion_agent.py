"""
Agent 1: Ingestion Agent (Multimodal Swarm)
============================================
Role: Continuously monitors all input channels. Normalizes complaint data
into a standard schema regardless of source.

Current Implementation: Mock normalization (no Whisper/OCR/NLP yet).
Future: Will integrate Whisper STT, Tesseract OCR, spaCy NLP, and
        webhook parsers for WhatsApp/Twitter.
"""

from datetime import datetime
from models.complaint import Complaint


class IngestionAgent:
    """
    Simulates multimodal complaint ingestion.
    Normalizes raw complaint text and marks it as ingested.
    """

    AGENT_NAME = "INGESTION"

    def process(self, complaint: Complaint) -> Complaint:
        """
        Process a single raw complaint through the ingestion pipeline.

        Steps:
        1. Normalize text (strip whitespace, lowercase for matching)
        2. Tag with ingestion timestamp
        3. Record source channel metadata
        4. Return enriched complaint

        Args:
            complaint: Raw Complaint object from any input channel.

        Returns:
            Complaint with normalized_text, ingested_at, and agent_notes updated.
        """
        log_prefix = f"[{self.AGENT_NAME}]"

        # Step 1: Normalize the raw text
        normalized = complaint.text.strip()
        complaint.normalized_text = normalized

        # Step 2: Timestamp ingestion
        complaint.ingested_at = datetime.utcnow().isoformat()

        # Step 3: Add agent notes
        reason_msg = f"Normalized text and verified source channel: {complaint.source.value}"
        complaint.reason = reason_msg
        complaint.agent_notes["ingestion"] = {
            "source_channel": complaint.source.value,
            "text_length": len(normalized),
            "has_location": bool(complaint.location),
            "processed_at": complaint.ingested_at,
            "reason": reason_msg
        }

        # Step 4: Log
        print(f"{log_prefix} Complaint received | ID={complaint.id[:8]} | Source={complaint.source.value}")
        print(f"{log_prefix} Reason={reason_msg}")
        print()

        return complaint
