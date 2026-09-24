from __future__ import annotations

from app.models import User
from app.repositories.frontend_compat_repository import FrontendCompatRepository
from app.schemas.frontend_compat import AdminStats, SettingsRead


class FrontendCompatService:
    def __init__(self, repo: FrontendCompatRepository | None = None):
        self.repo = repo

    async def get_admin_stats(self) -> AdminStats:
        if self.repo is None:
            raise ValueError("Repository is required")
        total_chairs = await self.repo.get_chair_count()
        active_chairs = await self.repo.get_active_chair_count()
        inactive_chairs = await self.repo.get_inactive_chair_count()
        total_users = await self.repo.get_user_count()
        active_alerts = await self.repo.get_alert_count()
        return AdminStats(
            totalChairs=total_chairs,
            activeChairs=active_chairs,
            inactiveChairs=inactive_chairs,
            totalUsers=total_users,
            activeAlerts=active_alerts,
            systemUptime="99.94%",
        )

    async def get_settings(self) -> SettingsRead:
        return SettingsRead(
            mqtt={
                "brokerUrl": "wss://broker.smartchair-iot.net:8084/mqtt",
                "status": "Connected",
                "latencyMs": 24,
                "topicPrefix": "iot/smartchair/v1/telemetry/",
                "qos": 1,
            },
            chair={
                "id": "ESP32-SC-9042",
                "model": "SmartChair Pro v2.4",
                "firmware": "v2.4.1-build809",
                "macAddress": "24:6F:28:B4:C9:10",
                "batteryLevel": 92,
                "isOnline": True,
                "sensorCount": 6,
            },
            calibration={
                "p1Offset": 0.0,
                "p2Offset": 0.0,
                "p3Offset": 3.2,
                "p4Offset": 0.0,
                "lastCalibrated": "2026-08-28 14:20",
            },
        )

    async def update_profile(self, user: User, updates: dict):
        profile = dict(updates)
        for field in ["name", "email", "age", "height", "weight", "gender", "dailyGoalHours", "recommendedBreakIntervalMinutes", "avatar"]:
            if field in profile and profile[field] is not None:
                if field == "email":
                    profile[field] = profile[field].lower()
                setattr(user, field, profile[field])
        return user

    async def get_admin_chairs(self):
        if self.repo is None:
            raise ValueError("Repository is required")
        chairs = await self.repo.list_chairs()
        return [
            {
                "id": item["chair_code"],
                "location": "Lab 3B - Desk 12",
                "user": "Dr. Alex Morgan",
                "status": "Online" if item["status"] == "online" else "Offline",
                "battery": "92%",
                "lastSeen": "Just now",
            }
            for item in chairs
        ]

    async def get_admin_users(self):
        if self.repo is None:
            raise ValueError("Repository is required")
        users = await self.repo.list_users()
        return [
            {
                "id": f"USR-{item['id']:03d}",
                "name": item["name"],
                "email": item["email"],
                "role": item["role"],
                "chairId": item["chair_id"],
                "status": "Active",
            }
            for item in users
        ]
