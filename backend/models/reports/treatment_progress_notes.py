from dataclasses import dataclass
from typing import List


@dataclass
class TreatmentProgressNotes:
    doctors_notes: str
    treatment_plans: List[str]
    follow_up_dates: List[str]