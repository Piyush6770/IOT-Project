#ifndef CHAIRSENSE_WIFI_MANAGER_H
#define CHAIRSENSE_WIFI_MANAGER_H

#include <Arduino.h>
#include <cstdint>

class WiFiManager
{
public:
    static void init();
    static void connectWiFi();
    static void startAccessPoint();
    static void maintainWiFi();
    static bool isWiFiConnected();
    static bool isAPActive();
    static int8_t getSignalStrength();
    static String getLocalIP();
    static String getAPIP();
    static String getSSID();
    static String getAPSSID();
    static String getMacAddress();

private:
    static unsigned long _lastReconnectAttempt;
    static bool _isConnected;
    static bool _isAPActive;
    static void _onWiFiConnected();
    static void _onWiFiDisconnected();
};

#endif // CHAIRSENSE_WIFI_MANAGER_H
