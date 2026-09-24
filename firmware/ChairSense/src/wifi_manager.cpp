#include "wifi_manager.h"

#include <ESP8266WiFi.h>

#include "config.h"

namespace
{
constexpr unsigned long WIFI_RECONNECT_INTERVAL_MS = 10000;
constexpr unsigned long WIFI_CONNECT_TIMEOUT_MS = 30000;
unsigned long lastReconnectAttempt = 0;
}

void connectWiFi()
{
  Serial.println(F("[WiFi] Startup: configuring station mode"));
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.persistent(false);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print(F("Connecting to WiFi"));
  const unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startedAt < WIFI_CONNECT_TIMEOUT_MS)
  {
    delay(500);
    Serial.print('.');
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println(F("Connected!"));
    Serial.print(F("IP Address: "));
    Serial.println(getLocalIP());
    Serial.print(F("[WiFi] IP acquisition complete; RSSI: "));
    Serial.print(WiFi.RSSI());
    Serial.println(F(" dBm"));
    lastReconnectAttempt = millis();
  }
  else
  {
    Serial.print(F("[WiFi] Connection failure; status code: "));
    Serial.println(static_cast<int>(WiFi.status()));
    lastReconnectAttempt = millis();
  }
}

void maintainWiFi()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    return;
  }

  if (millis() - lastReconnectAttempt < WIFI_RECONNECT_INTERVAL_MS)
  {
    return;
  }

  Serial.println(F("[WiFi] Disconnected; attempting reconnection"));
  lastReconnectAttempt = millis();
  WiFi.disconnect();
  connectWiFi();
}

String getLocalIP()
{
  return WiFi.localIP().toString();
}

bool isWiFiConnected()
{
  return WiFi.status() == WL_CONNECTED;
}