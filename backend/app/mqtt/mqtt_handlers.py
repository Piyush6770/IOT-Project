import json
import logging
from datetime import datetime, timezone
from sqlalchemy.exc import SQLAlchemyError
from app.database.session import AsyncSessionLocal
from app.schemas.common import SensorPayload
from app.services.ingestion_service import ingestion_service
from app.websocket.manager import manager

logger = logging.getLogger(__name__)


async def handle_sensor_message(topic: str, raw_payload: str) -> None:
    try:
        data = json.loads(raw_payload)
        if not isinstance(data, dict):
            return

        # Check if payload contains sensor telemetry data
        if any(k in data for k in ("pressure1", "fsr1_raw", "raw", "sensors", "seat_left")):
            # Normalize fields if needed
            if "chairId" not in data:
                data["chairId"] = data.get("deviceId", data.get("device_id", "CHAIR001"))
            if "timestamp" not in data or not data["timestamp"]:
                data["timestamp"] = datetime.now(timezone.utc).isoformat()
            
            # Extract from nested "sensors" dictionary if provided
            if "sensors" in data and isinstance(data["sensors"], dict):
                s = data["sensors"]
                if "pressure1" not in data:
                    data["pressure1"] = float(s.get("seat_left", s.get("pressure1", s.get("fsr1_raw", 0))))
                    data["pressure2"] = float(s.get("seat_right", s.get("pressure2", s.get("fsr2_raw", 0))))
                    data["pressure3"] = float(s.get("back_left", s.get("pressure3", s.get("fsr3_raw", 0))))
                    data["pressure4"] = float(s.get("back_right", s.get("pressure4", s.get("fsr4_raw", 0))))
            elif "seat_left" in data:
                if "pressure1" not in data:
                    data["pressure1"] = float(data.get("seat_left", 0))
                    data["pressure2"] = float(data.get("seat_right", 0))
                    data["pressure3"] = float(data.get("back_left", 0))
                    data["pressure4"] = float(data.get("back_right", 0))
            elif "pressure1" not in data and "fsr1_raw" in data:
                data["pressure1"] = float(data.get("fsr1_raw", 0))
                data["pressure2"] = float(data.get("fsr2_raw", 0))
                data["pressure3"] = float(data.get("fsr3_raw", 0))
                data["pressure4"] = float(data.get("fsr4_raw", 0))

            payload = SensorPayload.model_validate(data)
            async with AsyncSessionLocal() as db:
                await ingestion_service.process(payload, db)
        elif "status" in data or "uptime" in data:
            # Heartbeat, status, or diagnostic payload
            logger.info("Received device heartbeat/diagnostic on [%s]: %s", topic, raw_payload)
            await manager.broadcast({
                "type": "device_status",
                "topic": topic,
                "data": data
            })
    except (ValueError, SQLAlchemyError) as exc:
        logger.warning("MQTT payload processing error on topic %s: %s", topic, exc)
    except Exception as exc:
        logger.exception("Unexpected error processing MQTT message: %s", exc)
