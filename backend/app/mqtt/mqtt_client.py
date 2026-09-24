import asyncio
import logging
from collections.abc import Awaitable, Callable
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
        if self.settings.mqtt_username:
            self.client.username_pw_set(self.settings.mqtt_username, self.settings.mqtt_password)
        self.client.reconnect_delay_set(min_delay=1, max_delay=60)
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.client.on_disconnect = self._on_disconnect

    def _on_connect(self, client, userdata, flags, reason_code, properties=None):
        if reason_code == 0:
            client.subscribe(self.settings.mqtt_topic, qos=1)
            logger.info("MQTT connected broker=%s topic=%s", self.settings.mqtt_broker, self.settings.mqtt_topic)
        else:
            logger.error("MQTT connection failed reason=%s", reason_code)

    def _on_disconnect(self, client, userdata, disconnect_flags, reason_code, properties=None):
        logger.warning("MQTT disconnected reason=%s", reason_code)

    def _on_message(self, client, userdata, message):
        if self.loop is not None:
            asyncio.run_coroutine_threadsafe(self.handler(message.payload.decode("utf-8")), self.loop)

    async def start(self) -> None:
        self.loop = asyncio.get_running_loop()
        self.client.connect_async(self.settings.mqtt_broker, self.settings.mqtt_port, keepalive=60)
        self.client.loop_start()

    async def stop(self) -> None:
        self.client.loop_stop()
        self.client.disconnect()
        self.loop = None
