#ifndef CHAIRSENSE_MQTT_MANAGER_H
#define CHAIRSENSE_MQTT_MANAGER_H

#include <Arduino.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>

class MQTTManager
{
public:
    typedef void (*CommandCallback)(const char* topic, const uint8_t* payload, unsigned int length);

    static void init(CommandCallback callback = nullptr);
    static void connectMQTT();
    static void maintainMQTT();
    static bool isMQTTConnected();
    static bool publishMessage(const char* topic, const char* payload, bool retained = false);
    static bool publishTelemetry(int fsr1 = 0, int fsr2 = 0, int fsr3 = 0, int fsr4 = 0);
    static void subscribeTopics();
    static void loop();

private:
    static WiFiClient _wifiClient;
    static PubSubClient _mqttClient;
    static unsigned long _lastReconnectAttempt;
    static CommandCallback _userCallback;
    static void _internalCallback(char* topic, byte* payload, unsigned int length);
};

#endif // CHAIRSENSE_MQTT_MANAGER_H
