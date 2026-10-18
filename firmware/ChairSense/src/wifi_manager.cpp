#include "wifi_manager.h"
#include "config.h"
#include <ESP8266WiFi.h>

unsigned long WiFiManager::_lastReconnectAttempt = 0;
bool WiFiManager::_isConnected = false;
bool WiFiManager::_isAPActive = false;

void WiFiManager::init()
{
    Serial.println(F("[WiFi] Initializing WiFi Subsystem..."));
    
    if (WIFI_AP_MODE_ENABLED)
    {
        // Dual Mode: Broadcast Hotspot for direct laptop connection AND allow station connection
        WiFi.mode(WIFI_AP_STA);
        startAccessPoint();
    }
    else
    {
        WiFi.mode(WIFI_STA);
    }

    WiFi.setSleepMode(WIFI_NONE_SLEEP); // Maintain full RF power on powerbank
    WiFi.setAutoReconnect(true);
    delay(50);
}

void WiFiManager::startAccessPoint()
{
    IPAddress apIP(192, 168, 4, 1);
    IPAddress netMsk(255, 255, 255, 0);
    WiFi.softAPConfig(apIP, apIP, netMsk);

    bool apResult = WiFi.softAP(WIFI_AP_SSID, WIFI_AP_PASSWORD, WIFI_AP_CHANNEL, WIFI_AP_HIDDEN, WIFI_AP_MAX_CONN);
    _isAPActive = apResult;
    if (apResult)
    {
        Serial.println(F("\n========================================================"));
        Serial.println(F(" >>> ESP8266 WiFi Hotspot (AP Mode) Started!"));
        Serial.printf( " >>> Hotspot SSID    : %s\n", WIFI_AP_SSID);
        Serial.printf( " >>> Hotspot Password: %s\n", WIFI_AP_PASSWORD);
        Serial.printf( " >>> Hotspot IP      : %s\n", WiFi.softAPIP().toString().c_str());
        Serial.printf( " >>> Direct Web URL  : http://%s/\n", WiFi.softAPIP().toString().c_str());
        Serial.printf( " >>> Direct JSON URL : http://%s/sensor\n", WiFi.softAPIP().toString().c_str());
        Serial.println(F("========================================================\n"));
    }
    else
    {
        Serial.println(F("[WiFi] Failed to launch softAP!"));
    }
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
        delay(300);
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
    Serial.println(F("\n[WiFi] >>> Connected to WiFi!"));
    Serial.printf("[WiFi] IP Address: %s\n", getLocalIP().c_str());
    Serial.printf("[WiFi] RSSI: %d dBm\n", getSignalStrength());
    Serial.printf("[WiFi] Gateway: %s, Subnet: %s, DNS: %s\n", 
                  WiFi.gatewayIP().toString().c_str(),
                  WiFi.subnetMask().toString().c_str(),
                  WiFi.dnsIP().toString().c_str());
}

void WiFiManager::_onWiFiDisconnected()
{
    _isConnected = false;
    _lastReconnectAttempt = millis();
    Serial.printf("[WiFi] Connection attempt failed (Status code: %d)\n", static_cast<int>(WiFi.status()));
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
        Serial.println(F("[WiFi] Connection lost! Waiting to reconnect..."));
        _lastReconnectAttempt = millis();
    }

    // Allow at least 15 seconds for background auto-reconnect before triggering WiFi.begin again
    if (millis() - _lastReconnectAttempt >= 15000)
    {
        _lastReconnectAttempt = millis();
        Serial.println(F("[WiFi] Retrying WiFi connection..."));
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

bool WiFiManager::isAPActive()
{
    return _isAPActive;
}

String WiFiManager::getAPIP()
{
    return _isAPActive ? WiFi.softAPIP().toString() : "192.168.4.1";
}

String WiFiManager::getAPSSID()
{
    return String(WIFI_AP_SSID);
}