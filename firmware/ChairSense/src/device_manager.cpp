#include "device_manager.h"
#include "config.h"
#include "wifi_manager.h"
#include "sensor_manager.h"
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>

void DeviceManager::init()
{
    printHardwareDiagnostics();
}

void DeviceManager::printHardwareDiagnostics()
{
    Serial.println(F("\n======================================================="));
    Serial.println(F("           CHAIRSENSE HARDWARE DIAGNOSTICS            "));
    Serial.println(F("======================================================="));
    Serial.printf("Device ID       : %s\n", DEVICE_ID);
    Serial.printf("Firmware Version: %s\n", FIRMWARE_VERSION);
    Serial.printf("Hardware Model  : %s\n", HARDWARE_MODEL);
    Serial.printf("Chip ID         : 0x%08X\n", ESP.getChipId());
    Serial.printf("CPU Frequency   : %d MHz\n", ESP.getCpuFreqMHz());
    Serial.printf("Flash Chip ID   : 0x%08X\n", ESP.getFlashChipId());
    Serial.printf("Flash Real Size : %u bytes (%u KB / %u MB)\n", 
                  ESP.getFlashChipRealSize(), 
                  ESP.getFlashChipRealSize() / 1024, 
                  ESP.getFlashChipRealSize() / (1024 * 1024));
    Serial.printf("Flash Speed     : %u Hz\n", ESP.getFlashChipSpeed());
    Serial.printf("Free Heap       : %u bytes\n", ESP.getFreeHeap());
    Serial.printf("Heap Frag (%%)   : %u%%\n", ESP.getHeapFragmentation());
    Serial.printf("SDK Version     : %s\n", ESP.getSdkVersion());
    Serial.printf("Core Version    : %s\n", ESP.getCoreVersion().c_str());
    Serial.printf("MAC Address     : %s\n", WiFi.macAddress().c_str());
    Serial.printf("Baud Rate (COM) : 115200\n");
    Serial.println(F("=======================================================\n"));
}

String DeviceManager::getDeviceId()
{
    return String(DEVICE_ID);
}

String DeviceManager::getMacAddress()
{
    return WiFi.macAddress();
}

String DeviceManager::getFirmwareVersion()
{
    return String(FIRMWARE_VERSION);
}

String DeviceManager::getChipInfo()
{
    return String("ESP8266-") + String(ESP.getChipId(), HEX);
}

String DeviceManager::getFormattedTimestamp()
{
    unsigned long totalSec = millis() / 1000;
    unsigned int hours = (totalSec / 3600) % 24;
    unsigned int minutes = (totalSec / 60) % 60;
    unsigned int seconds = totalSec % 60;
    
    char buffer[32];
    snprintf(buffer, sizeof(buffer), "2026-10-02T%02u:%02u:%02uZ", hours, minutes, seconds);
    return String(buffer);
}

String DeviceManager::getRegistrationPayload()
{
    JsonDocument doc;
    doc["deviceId"] = DEVICE_ID;
    doc["macAddress"] = WiFi.macAddress();
    doc["ipAddress"] = WiFiManager::getLocalIP();
    doc["firmwareVersion"] = FIRMWARE_VERSION;
    doc["multiplexer"] = "CD74HC4067 (16-Ch)";
    doc["activeSensors"] = 4;
    doc["status"] = "online";

    String output;
    serializeJson(doc, output);
    return output;
}

String DeviceManager::getStatusPayload(const String& statusStr)
{
    JsonDocument doc;
    doc["device"] = DEVICE_ID;
    doc["status"] = statusStr;

    String output;
    serializeJson(doc, output);
    return output;
}

String DeviceManager::getTelemetryPayload(int fsr1, int fsr2, int fsr3, int fsr4)
{
    JsonDocument doc;
    doc["deviceId"] = DEVICE_ID;
    doc["chairId"] = DEVICE_ID;
    doc["status"] = "online";
    doc["wifi"] = WiFiManager::getSignalStrength();
    doc["rssi"] = WiFiManager::getSignalStrength();
    doc["timestamp"] = getFormattedTimestamp();
    
    // FSR 1 (Channel C0)
    doc["fsr1_raw"] = fsr1;
    doc["fsr1_voltage"] = static_cast<float>(fsr1 * 3.3f / 1023.0f);
    doc["fsr1_percent"] = static_cast<int>((fsr1 * 100) / 1023);
    doc["fsr1_status"] = SensorManager::getPressureDescription(fsr1);

    // FSR 2 (Channel C1)
    doc["fsr2_raw"] = fsr2;
    doc["fsr2_voltage"] = static_cast<float>(fsr2 * 3.3f / 1023.0f);
    doc["fsr2_percent"] = static_cast<int>((fsr2 * 100) / 1023);
    doc["fsr2_status"] = SensorManager::getPressureDescription(fsr2);

    // FSR 3 (Channel C2)
    doc["fsr3_raw"] = fsr3;
    doc["fsr3_voltage"] = static_cast<float>(fsr3 * 3.3f / 1023.0f);
    doc["fsr3_percent"] = static_cast<int>((fsr3 * 100) / 1023);
    doc["fsr3_status"] = SensorManager::getPressureDescription(fsr3);

    // FSR 4 (Channel C3)
    doc["fsr4_raw"] = fsr4;
    doc["fsr4_voltage"] = static_cast<float>(fsr4 * 3.3f / 1023.0f);
    doc["fsr4_percent"] = static_cast<int>((fsr4 * 100) / 1023);
    doc["fsr4_status"] = SensorManager::getPressureDescription(fsr4);

    // Standard multi-point pressure keys
    doc["pressure1"] = fsr1;
    doc["pressure2"] = fsr2;
    doc["pressure3"] = fsr3;
    doc["pressure4"] = fsr4;

    // Legacy backwards compatibility keys
    doc["raw"] = fsr1;
    doc["voltage"] = static_cast<float>(fsr1 * 3.3f / 1023.0f);
    doc["load_percent"] = static_cast<int>((fsr1 * 100) / 1023);
    doc["pressure_status"] = SensorManager::getPressureDescription(fsr1);

    String output;
    serializeJson(doc, output);
    return output;
}
