from dataclasses import dataclass
from typing import Dict, List


@dataclass
class MedicationHistory:
    medications: List[Dict[str, str]]