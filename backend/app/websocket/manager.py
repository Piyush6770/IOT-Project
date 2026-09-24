import asyncio
import logging
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self._connections: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.add(websocket)
        logger.info("WebSocket connected; clients=%s", len(self._connections))

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._connections.discard(websocket)
        logger.info("WebSocket disconnected; clients=%s", len(self._connections))

    async def broadcast(self, message: dict) -> None:
        async with self._lock:
            connections = list(self._connections)
        results = await asyncio.gather(*(connection.send_json(message) for connection in connections), return_exceptions=True)
        for connection, result in zip(connections, results):
            if isinstance(result, Exception):
                await self.disconnect(connection)


manager = ConnectionManager()
