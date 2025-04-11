from dataclasses import dataclass
from typing import List, Dict


@dataclass
class MedicalHistory:
    past_surgeries: List[str]
    chronic_conditions: List[str]
    hospitalizations: List[str]