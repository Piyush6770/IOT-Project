import asyncio
from datetime import datetime, timezone
import json
import logging
from collections.abc import Awaitable, Callable
from typing import Any
import paho.mqtt.client as mqtt
from app.core.config import get_settings

logger = logging.getLogger(__name__)
MessageHandler = Callable[[str], Awaitable[None]]


class MQTTClient:
    def __init__(self, handler: MessageHandler):
        self.settings = get_settings()
        self.handler = handler
        self.loop: asyncio.AbstractEventLoop | None = None
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        
        # Diagnostics & State
        self.is_connected: bool = False
        self.packets_received: int = 0
        self.last_packet_time: str | None = None
        self.last_payload: dict[str, Any] | None = None
        self.devices: dict[str, dict[str, Any]] = {}

        if self.settings.mqtt_username:
            self.client.username_pw_set(self.settings.mqtt_username, self.settings.mqtt_password)
        self.client.reconnect_delay_set(min_delay=1, max_delay=60)
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.client.on_disconnect = self._on_disconnect

    def _on_connect(self, client, userdata, flags, reason_code, properties=None):
        if reason_code == 0:
            self.is_connected = True
            # Subscribe to configured topic and smartchair wildcard
            topics = [(self.settings.mqtt_topic, 1), ("smartchair/#", 1)]
            client.subscribe(topics)
            logger.info("MQTT connected broker=%s topics=%s", self.settings.mqtt_broker, [t[0] for t in topics])
        else:
            self.is_connected = False
            logger.error("MQTT connection failed reason=%s", reason_code)

    def _on_disconnect(self, client, userdata, disconnect_flags, reason_code, properties=None):
        self.is_connected = False
        logger.warning("MQTT disconnected reason=%s", reason_code)

    def _on_message(self, client, userdata, message):
        self.packets_received += 1
        now_iso = datetime.now(timezone.utc).isoformat()
        self.last_packet_time = now_iso
        
        raw_text = message.payload.decode("utf-8", errors="ignore")
        try:
            parsed = json.loads(raw_text)
            self.last_payload = parsed
            
            # Extract device tracking metadata if present
            device_id = parsed.get("deviceId") or parsed.get("chairId") or parsed.get("device")
            if device_id:
                dev_key = str(device_id).upper()
                if dev_key not in self.devices:
                    self.devices[dev_key] = {"deviceId": dev_key}
                
                self.devices[dev_key].update({
                    "deviceId": dev_key,
                    "status": parsed.get("status", "online"),
                    "wifi": parsed.get("wifi", parsed.get("rssi")),
                    "rssi": parsed.get("rssi", parsed.get("wifi")),
                    "ipAddress": parsed.get("ipAddress", self.devices[dev_key].get("ipAddress")),
                    "macAddress": parsed.get("macAddress", self.devices[dev_key].get("macAddress")),
                    "firmwareVersion": parsed.get("firmwareVersion", self.devices[dev_key].get("firmwareVersion", "1.0.0")),
                    "lastSeen": now_iso,
                    "lastTopic": message.topic
                })
        except Exception:
            self.last_payload = {"raw": raw_text}

        if self.loop is not None:
            asyncio.run_coroutine_threadsafe(self.handler(raw_text), self.loop)

    async def start(self) -> None:
        self.loop = asyncio.get_running_loop()
        self.client.connect_async(self.settings.mqtt_broker, self.settings.mqtt_port, keepalive=60)
        self.client.loop_start()

    async def stop(self) -> None:
        self.client.loop_stop()
        self.client.disconnect()
        self.is_connected = False
        self.loop = None

    def get_status(self) -> dict[str, Any]:
        return {
            "connected": self.is_connected,
            "broker": self.settings.mqtt_broker,
            "port": self.settings.mqtt_port,
            "primaryTopic": self.settings.mqtt_topic,
            "packetsReceived": self.packets_received,
            "lastPacketTime": self.last_packet_time,
            "activeDevices": list(self.devices.keys())
        }

    def get_device(self, device_id: str) -> dict[str, Any] | None:
        return self.devices.get(device_id.upper())
