from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Alert, Chair, User


class FrontendCompatRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_chair_count(self) -> int:
        return int((await self.db.scalar(select(func.count()).select_from(Chair))))

    async def get_active_chair_count(self) -> int:
        return int((await self.db.scalar(select(func.count()).where(Chair.status == "online"))))

    async def get_inactive_chair_count(self) -> int:
        return int((await self.db.scalar(select(func.count()).where(Chair.status != "online"))))

    async def get_user_count(self) -> int:
        return int((await self.db.scalar(select(func.count()).select_from(User))))

    async def get_alert_count(self) -> int:
        return int((await self.db.scalar(select(func.count()).select_from(Alert))))

    async def list_chairs(self):
        result = await self.db.execute(select(Chair.id, Chair.chair_code, Chair.status).order_by(Chair.id))
        return [
            {"id": row[0], "chair_code": row[1], "status": row[2]}
            for row in result.all()
        ]

    async def list_users(self):
        result = await self.db.execute(
            select(User.id, User.name, User.email, User.role, Chair.chair_code.label("chair_id"))
            .outerjoin(Chair, Chair.id == User.id)
            .order_by(User.id)
        )
        return [
            {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "role": row[3],
                "chair_id": row[4],
            }
            for row in result.all()
        ]

    async def get_chair_by_code(self, chair_code: str):
        return await self.db.scalar(select(Chair).where(Chair.chair_code == chair_code))

    async def get_user_by_email(self, email: str):
        return await self.db.scalar(select(User).where(User.email == email.lower()))

    async def get_user_by_id(self, user_id: int):
        return await self.db.get(User, user_id)

    async def update_user(self, user: User, updates: dict):
        for key, value in updates.items():
            if value is not None:
                setattr(user, key, value)
        await self.db.flush()
        return user
