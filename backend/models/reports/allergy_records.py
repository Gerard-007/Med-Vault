from dataclasses import dataclass
from typing import List


@dataclass
class AllergyData:
    allergens: List[str]
    reactions: List[str]
    severity: str