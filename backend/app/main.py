from contextlib import asynccontextmanager
from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.mqtt.mqtt_subscriber import subscriber
from app.websocket.routes import router as websocket_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
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
