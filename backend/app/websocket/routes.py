from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from jose import JWTError, jwt
from app.core.config import get_settings
from app.websocket.manager import manager

router = APIRouter()


@router.websocket("/ws/live")
async def live_socket(websocket: WebSocket) -> None:
    token = websocket.query_params.get("token")
    settings = get_settings()
    try:
        if not token:
            raise JWTError
        jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        await websocket.close(code=1008, reason="Authentication required")
        return
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
