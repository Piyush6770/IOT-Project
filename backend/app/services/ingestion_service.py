import logging
from collections import defaultdict
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import get_settings
from app.models import Chair, PostureLog, SensorData, SedentaryAnalysis
from app.schemas.common import SensorPayload
from app.services.alert_service import build_alerts
from app.services.posture_service import classify_posture
from app.services.sedentary_service import calculate_sedentary_index
from app.websocket.manager import manager

logger = logging.getLogger(__name__)


class IngestionService:
    def __init__(self):
        self._sitting_started: dict[int, datetime] = {}
        self._bad_posture_started: dict[int, datetime] = {}
        self._break_counts: defaultdict[int, int] = defaultdict(int)

    async def process(self, payload: SensorPayload, db: AsyncSession) -> dict:
        chair = await db.scalar(select(Chair).where(Chair.chair_code == payload.chair_id))
        if chair is None:
            chair = Chair(chair_code=payload.chair_id, status="online")
            db.add(chair)
            await db.flush()
        chair.status = "online"
        posture = classify_posture(payload.pressure1, payload.pressure2, payload.pressure3, payload.pressure4)
        now = payload.timestamp if payload.timestamp.tzinfo else payload.timestamp.replace(tzinfo=timezone.utc)
        if posture.posture_type == "No User":
            self._break_counts[chair.id] += 1
            self._sitting_started.pop(chair.id, None)
            self._bad_posture_started.pop(chair.id, None)
        else:
            self._sitting_started.setdefault(chair.id, now)
            if posture.posture_type in {"Forward Lean", "Backward Lean", "Left Lean", "Right Lean", "Slouching"}:
                self._bad_posture_started.setdefault(chair.id, now)
            else:
                self._bad_posture_started.pop(chair.id, None)
        sitting_minutes = max(0.0, (now - self._sitting_started.get(chair.id, now)).total_seconds() / 60)
        bad_minutes = max(0.0, (now - self._bad_posture_started.get(chair.id, now)).total_seconds() / 60)
        sedentary = calculate_sedentary_index(sitting_minutes, 100.0 if posture.posture_type == "Correct" else 25.0, self._break_counts[chair.id], payload.heart_rate)
        db.add(SensorData(chair_id=chair.id, pressure1=payload.pressure1, pressure2=payload.pressure2, pressure3=payload.pressure3, pressure4=payload.pressure4, heart_rate=payload.heart_rate, temperature=payload.temperature, timestamp=now))
        db.add(PostureLog(chair_id=chair.id, posture_type=posture.posture_type, confidence=posture.confidence, timestamp=now))
        analysis = SedentaryAnalysis(chair_id=chair.id, sitting_duration=sedentary.sitting_duration, break_count=sedentary.break_count, sedentary_index=sedentary.sedentary_index, risk_level=sedentary.risk_level, timestamp=now)
        db.add(analysis)
        alerts = build_alerts(chair.id, posture.posture_type, sitting_minutes, bad_minutes, payload.heart_rate, get_settings().heart_rate_high_threshold)
        for alert in alerts:
            db.add(alert)
        await db.commit()
        result = {"type": "live_update", "chairId": payload.chair_id, "posture": posture.posture_type, "confidence": posture.confidence, "sensor": payload.model_dump(by_alias=True), "sbiScore": sedentary.sedentary_index, "riskLevel": sedentary.risk_level, "alerts": [{"type": alert.alert_type, "message": alert.message} for alert in alerts]}
        await manager.broadcast(result)
        logger.info("Processed sensor payload chair=%s posture=%s", payload.chair_id, posture.posture_type)
        return result


ingestion_service = IngestionService()
