#include "wifi_manager.h"
#include "config.h"
#include <ESP8266WiFi.h>

unsigned long WiFiManager::_lastReconnectAttempt = 0;
bool WiFiManager::_isConnected = false;

void WiFiManager::init()
{
    Serial.println(F("[WiFi] Initializing WiFi Subsystem..."));
    WiFi.mode(WIFI_STA);
    WiFi.setAutoReconnect(true);
    WiFi.persistent(false); // Protect flash wear
    WiFi.disconnect();
    delay(100);
}

void WiFiManager::connectWiFi()
{
    Serial.printf("[WiFi] Connecting to SSID: %s\n", WIFI_SSID);
    Serial.print(F("Connecting to WiFi"));

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    const unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && (millis() - startAttemptTime < WIFI_CONNECT_TIMEOUT_MS))
    {
        digitalWrite(STATUS_LED_PIN, !digitalRead(STATUS_LED_PIN));
        delay(500);
        Serial.print('.');
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED)
    {
        _onWiFiConnected();
    }
    else
    {
        _onWiFiDisconnected();
    }
}

void WiFiManager::_onWiFiConnected()
{
    _isConnected = true;
    _lastReconnectAttempt = millis();
    Serial.println(F("Connected"));
    Serial.printf("IP Address: %s\n", getLocalIP().c_str());
    Serial.printf("RSSI: %d dBm\n", getSignalStrength());
    Serial.printf("[WiFi] Gateway: %s, Subnet: %s, DNS: %s\n", 
                  WiFi.gatewayIP().toString().c_str(),
                  WiFi.subnetMask().toString().c_str(),
                  WiFi.dnsIP().toString().c_str());
}

void WiFiManager::_onWiFiDisconnected()
{
    _isConnected = false;
    _lastReconnectAttempt = millis();
    Serial.printf("[WiFi] Connection failed or dropped (Status: %d)\n", static_cast<int>(WiFi.status()));
}

void WiFiManager::maintainWiFi()
{
    if (WiFi.status() == WL_CONNECTED)
    {
        if (!_isConnected)
        {
            _onWiFiConnected();
        }
        return;
    }

    if (_isConnected)
    {
        _isConnected = false;
        Serial.println(F("[WiFi] Connection lost! Initiating auto-reconnect sequence..."));
    }

    if (millis() - _lastReconnectAttempt >= WIFI_RECONNECT_INTERVAL_MS)
    {
        _lastReconnectAttempt = millis();
        Serial.println(F("[WiFi] Retrying WiFi connection..."));
        WiFi.disconnect();
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    }
}

bool WiFiManager::isWiFiConnected()
{
    return WiFi.status() == WL_CONNECTED;
}

int8_t WiFiManager::getSignalStrength()
{
    return isWiFiConnected() ? WiFi.RSSI() : -100;
}

String WiFiManager::getLocalIP()
{
    return isWiFiConnected() ? WiFi.localIP().toString() : "0.0.0.0";
}

String WiFiManager::getSSID()
{
    return isWiFiConnected() ? WiFi.SSID() : String(WIFI_SSID);
}

String WiFiManager::getMacAddress()
{
    return WiFi.macAddress();
}