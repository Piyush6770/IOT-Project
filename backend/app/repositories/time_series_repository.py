from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Alert, PostureLog, SedentaryAnalysis


class TimeSeriesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def latest_posture(self, chair_id: int):
        return await self.db.scalar(select(PostureLog).where(PostureLog.chair_id == chair_id).order_by(desc(PostureLog.timestamp)).limit(1))

    async def posture_history(self, chair_id: int, limit: int = 100):
        return list(await self.db.scalars(select(PostureLog).where(PostureLog.chair_id == chair_id).order_by(desc(PostureLog.timestamp)).limit(limit)))

    async def latest_sedentary(self, chair_id: int):
        return await self.db.scalar(select(SedentaryAnalysis).where(SedentaryAnalysis.chair_id == chair_id).order_by(desc(SedentaryAnalysis.timestamp)).limit(1))

    async def sedentary_history(self, chair_id: int, limit: int = 100):
        return list(await self.db.scalars(select(SedentaryAnalysis).where(SedentaryAnalysis.chair_id == chair_id).order_by(desc(SedentaryAnalysis.timestamp)).limit(limit)))

    async def alerts(self, chair_id: int, limit: int = 100):
        return list(await self.db.scalars(select(Alert).where(Alert.chair_id == chair_id).order_by(desc(Alert.timestamp)).limit(limit)))
