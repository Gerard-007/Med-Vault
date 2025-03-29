from dataclasses import dataclass
from typing import List, Dict


@dataclass
class ImmunizationRecords:
    vaccinations: List[Dict[str, str]]