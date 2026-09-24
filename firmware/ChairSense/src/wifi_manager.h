#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <Arduino.h>

void connectWiFi();
void maintainWiFi();
String getLocalIP();
bool isWiFiConnected();

#endif