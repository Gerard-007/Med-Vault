from dataclasses import dataclass
from typing import List, Dict


@dataclass
class HealthIssues:
    issues: List[Dict[str, str]]