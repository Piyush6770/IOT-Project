#ifndef CHAIRSENSE_DEVICE_MANAGER_H
#define CHAIRSENSE_DEVICE_MANAGER_H

#include <Arduino.h>

class DeviceManager
{
public:
    static void init();
    static void printHardwareDiagnostics();
    static String getDeviceId();
    static String getMacAddress();
    static String getFirmwareVersion();
    static String getChipInfo();
    static String getRegistrationPayload();
    static String getStatusPayload(const String& statusStr = "online");
    static String getTelemetryPayload(int fsr1 = 0, int fsr2 = 0, int fsr3 = 0, int fsr4 = 0);
    static String getFormattedTimestamp();
};

#endif // CHAIRSENSE_DEVICE_MANAGER_H
