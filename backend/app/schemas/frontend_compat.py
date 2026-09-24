from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class ForgotPasswordRequest(ORMModel):
    email: str


class ResetPasswordRequest(ORMModel):
    email: str
    password: str = Field(min_length=8, max_length=128)
    token: str | None = None


class ProfileUpdateRequest(ORMModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    email: str | None = None
    age: int | None = Field(default=None, ge=13, le=120)
    height: float | None = Field(default=None, gt=0, le=300)
    weight: float | None = Field(default=None, gt=0, le=500)
    gender: str | None = None
    dailyGoalHours: float | None = None
    recommendedBreakIntervalMinutes: int | None = None
    avatar: str | None = None


class UserProfileRead(ORMModel):
    id: int
    name: str
    email: str
    role: str = "User"
    age: int | None = None
    height: float | None = None
    weight: float | None = None
    gender: str | None = None
    dailyGoalHours: float | None = None
    recommendedBreakIntervalMinutes: int | None = None
    avatar: str | None = None


class MqttSettingsRead(ORMModel):
    brokerUrl: str = "wss://broker.smartchair-iot.net:8084/mqtt"
    status: str = "Connected"
    latencyMs: int = 24
    topicPrefix: str = "iot/smartchair/v1/telemetry/"
    qos: int = 1


class ChairSettingsRead(ORMModel):
    id: str = "ESP32-SC-9042"
    model: str = "SmartChair Pro v2.4"
    firmware: str = "v2.4.1-build809"
    macAddress: str = "24:6F:28:B4:C9:10"
    batteryLevel: int = 92
    isOnline: bool = True
    sensorCount: int = 6


class CalibrationSettingsRead(ORMModel):
    p1Offset: float = 0.0
    p2Offset: float = 0.0
    p3Offset: float = 3.2
    p4Offset: float = 0.0
    lastCalibrated: str = "2026-08-28 14:20"


class SettingsRead(ORMModel):
    mqtt: MqttSettingsRead
    chair: ChairSettingsRead
    calibration: CalibrationSettingsRead


class SettingsWrite(ORMModel):
    mqtt: MqttSettingsRead | None = None
    chair: ChairSettingsRead | None = None
    calibration: CalibrationSettingsRead | None = None


class AdminStats(ORMModel):
    totalChairs: int
    activeChairs: int
    inactiveChairs: int
    totalUsers: int
    activeAlerts: int
    systemUptime: str = "99.94%"


class AdminChairRead(ORMModel):
    id: str
    location: str
    user: str | None = None
    status: str
    battery: str
    lastSeen: str


class AdminUserRead(ORMModel):
    id: str
    name: str
    email: str
    role: str
    chairId: str | None = None
    status: str = "Active"


class AlertAckResponse(ORMModel):
    alertId: int
    status: str = "acknowledged"
    acknowledgedAt: datetime | None = None


class AlertDismissRequest(ORMModel):
    alert_ids: list[int] = Field(default_factory=list)


class AlertDismissResponse(ORMModel):
    dismissed: list[int]
    remaining: int


class ChairStreamToggleRequest(ORMModel):
    enabled: bool = True


class ChairStreamToggleResponse(ORMModel):
    chairCode: str
    streaming: bool
    status: str = "updated"


class ForcePostureRequest(ORMModel):
    posture: str = Field(..., min_length=1)


class ForcePostureResponse(ORMModel):
    chairCode: str
    posture: str
    confidence: float
    status: str = "updated"


class PasswordResetAck(ORMModel):
    status: str = "queued"
    email: str
    message: str = "Password reset instructions sent."


class SettingsCalibrationRequest(ORMModel):
    p1Offset: float | None = None
    p2Offset: float | None = None
    p3Offset: float | None = None
    p4Offset: float | None = None
