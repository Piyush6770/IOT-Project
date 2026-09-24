#include <Arduino.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "config.h"
#include "wifi_manager.h"

namespace
{
constexpr uint8_t BUILTIN_LED_PIN = LED_BUILTIN;
constexpr unsigned long RSSI_INTERVAL_MS = 10000;
constexpr unsigned long MQTT_PUBLISH_INTERVAL_MS = 5000;
constexpr unsigned long MQTT_RECONNECT_INTERVAL_MS = 5000;
unsigned long lastRssiReport = 0;
unsigned long lastMqttPublish = 0;
unsigned long lastMqttReconnectAttempt = 0;
ESP8266WebServer server(80);
WiFiClient mqttNetworkClient;
PubSubClient mqttClient(mqttNetworkClient);

void mqttMessageCallback(char *topic, byte *payload, unsigned int length)
{
  Serial.print(F("[MQTT] Message received on "));
  Serial.println(topic);
  Serial.print(F("[MQTT] Payload length: "));
  Serial.println(length);
}

void connectMQTT()
{
  if (!isWiFiConnected() || mqttClient.connected() ||
      millis() - lastMqttReconnectAttempt < MQTT_RECONNECT_INTERVAL_MS)
  {
    return;
  }

  lastMqttReconnectAttempt = millis();
  Serial.print(F("[MQTT] Connecting to broker "));
  Serial.print(MQTT_BROKER_HOST);
  Serial.print(':');
  Serial.println(MQTT_BROKER_PORT);

  const bool connected = mqttClient.connect(
      MQTT_CLIENT_ID,
      MQTT_USERNAME,
      MQTT_PASSWORD,
      MQTT_STATUS_TOPIC,
      0,
      true,
      "offline");

  if (connected)
  {
    Serial.println(F("[MQTT] Broker connected"));
    mqttClient.publish(MQTT_STATUS_TOPIC, "online", true);
    mqttClient.subscribe(MQTT_COMMAND_TOPIC);
  }
  else
  {
    Serial.print(F("[MQTT] Connection failed; state: "));
    Serial.println(mqttClient.state());
  }
}

void publishSensorValue()
{
  if (!mqttClient.connected() || millis() - lastMqttPublish < MQTT_PUBLISH_INTERVAL_MS)
  {
    return;
  }

  lastMqttPublish = millis();
  float sensorValue = 0.0;
  String payload = F("{\"device\":\"");
  payload += MQTT_CLIENT_ID;
  payload += F("\",\"sensorValue\":");
  payload += String(sensorValue, 2);
  payload += F(",\"rssi\":");
  payload += String(WiFi.RSSI());
  payload += '}';

  if (mqttClient.publish(MQTT_SENSOR_TOPIC, payload.c_str()))
  {
    Serial.print(F("[MQTT] Data published successfully: "));
    Serial.println(payload);
  }
  else
  {
    Serial.println(F("[MQTT] Data publish failed"));
  }
}

void handleRoot()
{
  String response = F("{\"device\":\"ESP8266\",\"status\":\"online\",\"ip\":\"");
  response += getLocalIP();
  response += F("\"}");
  server.send(200, F("application/json"), response);
}

void handleNotFound()
{
  server.send(404, F("application/json"), F("{\"error\":\"not_found\"}"));
}

void reportRSSI()
{
  if (!isWiFiConnected() || millis() - lastRssiReport < RSSI_INTERVAL_MS)
  {
    return;
  }

  Serial.print(F("RSSI: "));
  Serial.print(WiFi.RSSI());
  Serial.println(F(" dBm"));
  lastRssiReport = millis();
}
}

void setup()
{
  Serial.begin(115200);
  delay(100);
  Serial.println();
  Serial.println(F("[System] ESP8266 WiFi verification firmware starting"));

  pinMode(BUILTIN_LED_PIN, OUTPUT);
  digitalWrite(BUILTIN_LED_PIN, HIGH);

  connectWiFi();
  mqttClient.setServer(MQTT_BROKER_HOST, MQTT_BROKER_PORT);
  mqttClient.setCallback(mqttMessageCallback);

  server.on(F("/"), HTTP_GET, handleRoot);
  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println(F("[HTTP] Web server listening on port 80"));

  if (isWiFiConnected())
  {
    Serial.println(F("Open browser:"));
    Serial.print(F("http://"));
    Serial.println(getLocalIP());
  }
}

void loop()
{
  maintainWiFi();
  connectMQTT();
  mqttClient.loop();
  publishSensorValue();
  server.handleClient();
  digitalWrite(BUILTIN_LED_PIN, isWiFiConnected() ? LOW : HIGH);
  reportRSSI();
}