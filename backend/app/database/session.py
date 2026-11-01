from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


from sqlalchemy.pool import NullPool

settings = get_settings()
connect_args = {}
engine_kwargs = {"pool_pre_ping": True}

if "postgres" in settings.database_url:
    connect_args = {"ssl": "require", "statement_cache_size": 0}
    engine_kwargs["poolclass"] = NullPool
else:
    engine_kwargs["pool_recycle"] = 1800

engine = create_async_engine(settings.database_url, connect_args=connect_args, **engine_kwargs)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
