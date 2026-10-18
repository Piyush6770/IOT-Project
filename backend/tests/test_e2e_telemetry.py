import pytest
from datetime import datetime, timezone
from sqlalchemy import select
from app.database.session import AsyncSessionLocal
from app.models import Chair, SensorData, PostureLog, SedentaryAnalysis
from app.mqtt.mqtt_handlers import handle_sensor_message
from app.services.posture_service import classify_posture
from app.services.sedentary_service import calculate_sedentary_index


@pytest.mark.anyio
async def test_chairsense_telemetry_ingestion_and_normalization():
    # Canonical ChairSense payload as produced by ESP8266 + CD74HC4067 firmware
    payload = """{
      "schema_version": 1,
      "deviceId": "CHAIR001",
      "uptime_ms": 123456,
      "sensors": {
        "seat_left": 120,
        "seat_right": 135,
        "back_left": 80,
        "back_right": 85
      },
      "occupancy": true
    }"""

    await handle_sensor_message("smartchair/chair001/sensors", payload)

    async with AsyncSessionLocal() as session:
        chair = await session.scalar(select(Chair).where(Chair.chair_code == "CHAIR001"))
        assert chair is not None
        assert chair.status == "online"

        sensor_row = await session.scalar(
            select(SensorData)
            .where(SensorData.chair_id == chair.id)
            .order_by(SensorData.timestamp.desc())
            .limit(1)
        )
        assert sensor_row is not None
        assert float(sensor_row.pressure1) == 120.0
        assert float(sensor_row.pressure2) == 135.0
        assert float(sensor_row.pressure3) == 80.0
        assert float(sensor_row.pressure4) == 85.0
        assert sensor_row.heart_rate is None
        assert sensor_row.temperature is None


@pytest.mark.anyio
async def test_chairsense_empty_chair_handling():
    payload = """{
      "schema_version": 1,
      "deviceId": "CHAIR001",
      "uptime_ms": 125000,
      "sensors": {
        "seat_left": 0,
        "seat_right": 0,
        "back_left": 0,
        "back_right": 0
      },
      "occupancy": false
    }"""

    await handle_sensor_message("smartchair/chair001/sensors", payload)

    async with AsyncSessionLocal() as session:
        chair = await session.scalar(select(Chair).where(Chair.chair_code == "CHAIR001"))
        assert chair is not None

        posture_row = await session.scalar(
            select(PostureLog)
            .where(PostureLog.chair_id == chair.id)
            .order_by(PostureLog.timestamp.desc())
            .limit(1)
        )
        assert posture_row is not None
        assert posture_row.posture_type == "No User"


def test_posture_classification_quad_fsr():
    # Empty chair
    empty = classify_posture(0, 0, 0, 0)
    assert empty.posture_type == "No User"

    # Balanced sitting
    balanced = classify_posture(40, 42, 35, 38)
    assert balanced.posture_type == "Correct"

    # Left asymmetry
    left = classify_posture(90, 20, 80, 15)
    assert left.posture_type == "Left Lean"

    # Right asymmetry
    right = classify_posture(15, 95, 20, 85)
    assert right.posture_type == "Right Lean"
