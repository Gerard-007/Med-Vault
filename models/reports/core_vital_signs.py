from dataclasses import dataclass

from mongoengine import Document, ListField, StringField, IntField, FloatField, DateTimeField


@dataclass
class CoreVitalSigns:
    blood_pressure: str
    heart_rate: int
    temperature: float
    recorded_at: str