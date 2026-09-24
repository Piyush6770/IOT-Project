import pytest

from app.models import User
from app.schemas.frontend_compat import AdminStats, SettingsRead
from app.services.frontend_compat_service import FrontendCompatService


class DummyRepo:
    def __init__(self):
        self.chair_count = 3
        self.active_chairs = 2
        self.inactive_chairs = 1
        self.user_count = 4
        self.alert_count = 5

    async def get_chair_count(self):
        return self.chair_count

    async def get_active_chair_count(self):
        return self.active_chairs

    async def get_inactive_chair_count(self):
        return self.inactive_chairs

    async def get_user_count(self):
        return self.user_count

    async def get_alert_count(self):
        return self.alert_count

    async def list_chairs(self):
        return [
            {"id": 1, "chair_code": "ESP32-SC-9042", "status": "online"},
            {"id": 2, "chair_code": "ESP32-SC-9043", "status": "offline"},
        ]

    async def list_users(self):
        return [
            {"id": 1, "name": "Dr. Alex Morgan", "email": "alex@healthiot.org", "role": "User", "chair_id": "ESP32-SC-9042"},
            {"id": 2, "name": "Prof. Sarah Jenkins", "email": "sarah@healthiot.org", "role": "Admin", "chair_id": "ESP32-SC-9043"},
        ]


@pytest.mark.asyncio
async def test_profile_update_service_returns_user_payload():
    service = FrontendCompatService(repo=DummyRepo())
    user = User(
        id=7,
        name="Old Name",
        email="old@example.com",
        password_hash="hashed",
        role="User",
        age=28,
        height=175,
        weight=70,
    )

    result = await service.update_profile(user, {"name": "New Name", "weight": 72})

    assert result.name == "New Name"
    assert result.weight == 72
    assert result.email == "old@example.com"


@pytest.mark.asyncio
async def test_admin_stats_are_built_from_repo_counts():
    service = FrontendCompatService(repo=DummyRepo())

    result = await service.get_admin_stats()

    assert isinstance(result, AdminStats)
    assert result.totalChairs == 3
    assert result.activeChairs == 2
    assert result.inactiveChairs == 1
    assert result.totalUsers == 4
    assert result.activeAlerts == 5


@pytest.mark.asyncio
async def test_settings_service_uses_frontend_shape():
    service = FrontendCompatService(repo=DummyRepo())

    result = await service.get_settings()

    assert isinstance(result, SettingsRead)
    assert result.mqtt.brokerUrl == "wss://broker.smartchair-iot.net:8084/mqtt"
    assert result.chair.id == "ESP32-SC-9042"
    assert result.calibration.p3Offset == 3.2
