import json
import logging
from sqlalchemy.exc import SQLAlchemyError
from app.database.session import AsyncSessionLocal
from app.schemas.common import SensorPayload
from app.services.ingestion_service import ingestion_service

logger = logging.getLogger(__name__)


async def handle_sensor_message(raw_payload: str) -> None:
    try:
        payload = SensorPayload.model_validate(json.loads(raw_payload))
        async with AsyncSessionLocal() as db:
            await ingestion_service.process(payload, db)
    except (ValueError, SQLAlchemyError) as exc:
        logger.exception("MQTT sensor payload processing failed: %s", exc)
