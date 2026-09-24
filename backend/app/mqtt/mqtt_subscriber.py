from app.mqtt.mqtt_client import MQTTClient
from app.mqtt.mqtt_handlers import handle_sensor_message


subscriber = MQTTClient(handle_sensor_message)
