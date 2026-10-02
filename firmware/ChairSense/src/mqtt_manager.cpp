#include "mqtt_manager.h"
#include "config.h"
#include "wifi_manager.h"
#include "device_manager.h"

WiFiClient MQTTManager::_wifiClient;
PubSubClient MQTTManager::_mqttClient(_wifiClient);
unsigned long MQTTManager::_lastReconnectAttempt = 0;
MQTTManager::CommandCallback MQTTManager::_userCallback = nullptr;

void MQTTManager::init(CommandCallback callback)
{
    _userCallback = callback;
    _mqttClient.setServer(MQTT_BROKER_HOST, MQTT_BROKER_PORT);
    _mqttClient.setCallback(_internalCallback);
    _mqttClient.setKeepAlive(MQTT_KEEPALIVE_SEC);
    _mqttClient.setBufferSize(512); // Ensure JSON payloads fit comfortably
    Serial.printf("[MQTT] Initialized target broker: %s:%u, ClientID: %s\n", 
                  MQTT_BROKER_HOST, MQTT_BROKER_PORT, MQTT_CLIENT_ID);
}

void MQTTManager::_internalCallback(char* topic, byte* payload, unsigned int length)
{
    Serial.printf("[MQTT] Incoming message on [%s], Length: %u\n", topic, length);
    
    // Print payload for serial debugging
    String msg;
    for (unsigned int i = 0; i < length; i++)
    {
        msg += static_cast<char>(payload[i]);
    }
    Serial.printf("[MQTT] Payload: %s\n", msg.c_str());

    if (_userCallback)
    {
        _userCallback(topic, payload, length);
    }
}

void MQTTManager::connectMQTT()
{
    if (!WiFiManager::isWiFiConnected() || _mqttClient.connected())
    {
        return;
    }

    if (millis() - _lastReconnectAttempt < MQTT_RECONNECT_INTERVAL_MS)
    {
        return;
    }

    _lastReconnectAttempt = millis();
    Serial.printf("[MQTT] Attempting connection to %s:%u (ClientID: %s)...\n", 
                  MQTT_BROKER_HOST, MQTT_BROKER_PORT, MQTT_CLIENT_ID);

    // Prepare Last Will and Testament (LWT)
    const char* lwtTopic = MQTT_STATUS_TOPIC;
    const char* lwtMessage = "{\"device\":\"CHAIR001\",\"status\":\"offline\"}";
    const uint8_t lwtQoS = 1;
    const bool lwtRetain = true;

    bool connected = false;
    if (strlen(MQTT_USERNAME) > 0)
    {
        connected = _mqttClient.connect(MQTT_CLIENT_ID, MQTT_USERNAME, MQTT_PASSWORD, 
                                        lwtTopic, lwtQoS, lwtRetain, lwtMessage);
    }
    else
    {
        connected = _mqttClient.connect(MQTT_CLIENT_ID, lwtTopic, lwtQoS, lwtRetain, lwtMessage);
    }

    if (connected)
    {
        Serial.println(F("[MQTT] Connected successfully!"));
        
        // Publish online status
        String onlinePayload = DeviceManager::getStatusPayload("online");
        publishMessage(MQTT_STATUS_TOPIC, onlinePayload.c_str(), true);

        // Publish registration metadata
        String regPayload = DeviceManager::getRegistrationPayload();
        publishMessage(MQTT_REGISTRATION_TOPIC, regPayload.c_str(), true);

        // Subscribe to commands topic
        subscribeTopics();
    }
    else
    {
        Serial.printf("[MQTT] Connection failed, rc=%d. Will retry in %lu ms\n", 
                      _mqttClient.state(), MQTT_RECONNECT_INTERVAL_MS);
    }
}

void MQTTManager::subscribeTopics()
{
    if (_mqttClient.connected())
    {
        _mqttClient.subscribe(MQTT_COMMAND_TOPIC, 1);
        Serial.printf("[MQTT] Subscribed to command topic: %s\n", MQTT_COMMAND_TOPIC);
    }
}

void MQTTManager::maintainMQTT()
{
    if (!WiFiManager::isWiFiConnected())
    {
        return;
    }

    if (!_mqttClient.connected())
    {
        connectMQTT();
    }
    else
    {
        _mqttClient.loop();
    }
}

bool MQTTManager::isMQTTConnected()
{
    return _mqttClient.connected();
}

void MQTTManager::loop()
{
    if (_mqttClient.connected())
    {
        _mqttClient.loop();
    }
}

bool MQTTManager::publishMessage(const char* topic, const char* payload, bool retained)
{
    if (!_mqttClient.connected())
    {
        Serial.println(F("[MQTT] Cannot publish: Broker not connected"));
        return false;
    }

    bool success = _mqttClient.publish(topic, payload, retained);
    if (success)
    {
        Serial.printf("[MQTT] Published to [%s]: %s\n", topic, payload);
    }
    else
    {
        Serial.printf("[MQTT] Publish to [%s] failed!\n", topic);
    }
    return success;
}

bool MQTTManager::publishTelemetry(int fsr1, int fsr2, int fsr3, int fsr4)
{
    String payload = DeviceManager::getTelemetryPayload(fsr1, fsr2, fsr3, fsr4);
    return publishMessage(MQTT_SENSOR_TOPIC, payload.c_str(), false);
}
