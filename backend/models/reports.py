from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict
import uuid

@dataclass
class BaseData:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))  # Unique ID for each record
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())  # Creation timestamp
    created_by: str = field(default="")  # User who created the record
    updated_at: str = field(default_factory=lambda: datetime.now().isoformat())  # Last update timestamp
    updated_by: str = field(default="")  # User who last updated the record

@dataclass
class AllergyData(BaseData):
    allergens: List[str]
    reactions: List[str]
    severity: str

@dataclass
class CoreVitalSigns(BaseData):
    blood_pressure: str
    heart_rate: int
    temperature: float
    recorded_at: str

@dataclass
class HealthIssues(BaseData):
    issues: List[Dict[str, str]]

@dataclass
class ImmunizationRecords(BaseData):
    vaccinations: List[Dict[str, str]]

@dataclass
class LaboratoryTestResults(BaseData):
    results: List[Dict[str, str]]

@dataclass
class MedicalHistory(BaseData):
    past_surgeries: List[str]
    chronic_conditions: List[str]
    hospitalizations: List[str]

@dataclass
class MedicationHistory(BaseData):
    medications: List[Dict[str, str]]

@dataclass
class RadiologyReports(BaseData):
    reports: List[Dict[str, str]]

@dataclass
class TreatmentProgressNotes(BaseData):
    doctors_notes: str
    treatment_plans: List[str]
    follow_up_dates: List[str]