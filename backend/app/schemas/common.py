from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SensorPayload(BaseModel):
    chair_id: str = Field(alias="chairId")
    timestamp: datetime
    pressure1: float = Field(ge=0)
    pressure2: float = Field(ge=0)
    pressure3: float = Field(ge=0)
    pressure4: float = Field(ge=0)
    heart_rate: float | None = Field(default=None, alias="heartRate", ge=0, le=300)
    temperature: float | None = Field(default=None, ge=-50, le=100)


class SensorRead(ORMModel):
    id: int
    chair_id: int
    pressure1: float
    pressure2: float
    pressure3: float
    pressure4: float
    heart_rate: float | None
    temperature: float | None
    timestamp: datetime


class PostureRead(ORMModel):
    id: int
    chair_id: int
    posture_type: str
    confidence: float
    timestamp: datetime


class SedentaryRead(ORMModel):
    id: int
    chair_id: int
    sitting_duration: float
    break_count: int
    sedentary_index: float
    risk_level: str
    timestamp: datetime


class AlertRead(ORMModel):
    id: int
    chair_id: int
    alert_type: str
    message: str
    timestamp: datetime
