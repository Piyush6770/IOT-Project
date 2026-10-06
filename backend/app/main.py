from contextlib import asynccontextmanager
from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.mqtt.mqtt_subscriber import subscriber
from app.websocket.routes import router as websocket_router


from sqlalchemy import select
from app.database.session import Base, engine, AsyncSessionLocal
from app.models import User, Chair
from app.core.security import hash_password


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    
    # Ensure database schema is created
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed default user and chair if not present
    async with AsyncSessionLocal() as session:
        user = await session.scalar(select(User).where(User.email == "alex.morgan@healthiot.org"))
        if not user:
            session.add(User(
                name="Dr. Alex Morgan",
                email="alex.morgan@healthiot.org",
                password_hash=hash_password("smartchair2026"),
                role="Admin",
                age=32,
                height=178,
                weight=72,
            ))
        chair = await session.scalar(select(Chair).where(Chair.chair_code == "CHAIR001"))
        if not chair:
            session.add(Chair(chair_code="CHAIR001", status="online"))
        await session.commit()

    await subscriber.start()
    yield
    await subscriber.stop()


settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware, 
    allow_origins=settings.cors_origin_list, 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# Core Routers
app.include_router(api_router, prefix="/api/v1")
app.include_router(websocket_router)


# ==============================================================================
# System & Pipeline Verification Endpoints (Phases 1, 5, 7)
# ==============================================================================
@app.get("/health", tags=["System"])
async def health() -> dict[str, str]:
    """Basic service health check."""
    return {"status": "ok", "service": settings.app_name, "health": "ok"}


@app.get("/mqtt/status", tags=["Verification"])
async def mqtt_status() -> dict[str, Any]:
    """Returns current MQTT broker connection status and packet statistics."""
    return subscriber.get_status()


@app.get("/device/{device_id}", tags=["Verification"])
async def get_device_info(device_id: str) -> dict[str, Any]:
    """Returns live telemetry, metadata, and connection status for a specific chair/device."""
    device_data = subscriber.get_device(device_id)
    if not device_data:
        # Provide default template if device has not checked in yet
        return {
            "deviceId": device_id.upper(),
            "status": "offline",
            "wifi": None,
            "rssi": None,
            "ipAddress": None,
            "macAddress": None,
            "firmwareVersion": "1.0.0",
            "lastSeen": None,
            "message": "Device not yet observed on MQTT bus"
        }
    return device_data
