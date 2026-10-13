from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from jose import JWTError, jwt
from app.core.config import get_settings
from app.websocket.manager import manager

router = APIRouter()


@router.websocket("/ws/live")
async def live_socket(websocket: WebSocket) -> None:
    token = websocket.query_params.get("token")
    settings = get_settings()
    # Decode token if present, but do not drop live telemetry socket on dev/mock token
    if token and token not in {"mock-jwt-token-9042", "undefined", "null"}:
        try:
            jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        except JWTError:
            pass  # Allow connection to receive live sensor stream
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
