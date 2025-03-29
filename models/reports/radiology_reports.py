from dataclasses import dataclass
from typing import List, Dict


@dataclass
class RadiologyReports:
    reports: List[Dict[str, str]]