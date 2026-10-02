#ifndef CHAIRSENSE_WIFI_MANAGER_H
#define CHAIRSENSE_WIFI_MANAGER_H

#include <Arduino.h>

class WiFiManager
{
public:
    static void init();
    static void connectWiFi();
    static void maintainWiFi();
    static bool isWiFiConnected();
    static int8_t getSignalStrength();
    static String getLocalIP();
    static String getSSID();
    static String getMacAddress();

private:
    static unsigned long _lastReconnectAttempt;
    static bool _isConnected;
    static void _onWiFiConnected();
    static void _onWiFiDisconnected();
};

#endif // CHAIRSENSE_WIFI_MANAGER_H
