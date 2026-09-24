from datetime import datetime
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import SensorData


class SensorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def add(self, data: SensorData) -> SensorData:
        self.db.add(data)
        await self.db.flush()
        return data

    async def latest(self, chair_id: int) -> SensorData | None:
        return await self.db.scalar(select(SensorData).where(SensorData.chair_id == chair_id).order_by(desc(SensorData.timestamp)).limit(1))

    async def history(self, chair_id: int, start: datetime | None = None, end: datetime | None = None, limit: int = 100) -> list[SensorData]:
        query = select(SensorData).where(SensorData.chair_id == chair_id)
        if start:
            query = query.where(SensorData.timestamp >= start)
        if end:
            query = query.where(SensorData.timestamp <= end)
        result = await self.db.scalars(query.order_by(desc(SensorData.timestamp)).limit(limit))
        return list(result)
