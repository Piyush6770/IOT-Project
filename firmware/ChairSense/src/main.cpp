#include <Arduino.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

#include "config.h"
#include "device_manager.h"
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "sensor_manager.h"

// ==============================================================================
// Global Instances & State Tracking
// ==============================================================================
ESP8266WebServer httpServer(80);

unsigned long lastTelemetryPublish = 0;
unsigned long lastRssiLog = 0;
unsigned long lastLedToggle = 0;
unsigned long lastSerialLog = 0;
bool ledState = false;

// ==============================================================================
// Command & MQTT Callback Handler
// ==============================================================================
void handleCommand(const char* topic, const uint8_t* payload, unsigned int length)
{
    char buffer[256];
    unsigned int copyLen = (length < sizeof(buffer) - 1) ? length : (sizeof(buffer) - 1);
    memcpy(buffer, payload, copyLen);
    buffer[copyLen] = '\0';

    Serial.printf("[Command] Received on %s: %s\n", topic, buffer);

    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, buffer);
    if (!error)
    {
        if (doc["reboot"].as<bool>())
        {
            Serial.println(F("[Command] Reboot command triggered. Restarting..."));
            delay(500);
            ESP.restart();
        }
    }
}

// ==============================================================================
// HTTP Local Web Dashboard (Phase 4 & Live Browser Dashboard)
// ==============================================================================
void handleHttpRoot()
{
    int s1 = 0, s2 = 0, s3 = 0, s4 = 0;
    SensorManager::readAllSensors(s1, s2, s3, s4);
    float v1 = SensorManager::getVoltage(s1);
    float v2 = SensorManager::getVoltage(s2);
    float v3 = SensorManager::getVoltage(s3);
    float v4 = SensorManager::getVoltage(s4);

    String html = F("<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'>");
    html += F("<title>ChairSense Quad FSR Live Monitor</title>");
    html += F("<style>");
    html += F("body{font-family:'Segoe UI',system-ui,sans-serif;background:#0f172a;color:#f8fafc;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;padding:16px;box-sizing:border-box;}");
    html += F(".card{background:#1e293b;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.5);padding:24px;width:100%;max-width:680px;text-align:center;border:1px solid #334155;}");
    html += F("h1{margin:0 0 4px;font-size:24px;color:#38bdf8;}");
    html += F(".sub{color:#94a3b8;font-size:13px;margin-bottom:20px;}");
    html += F(".sensor-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}");
    html += F(".sensor-box{background:#0f172a;border-radius:12px;padding:16px;border:1px solid #334155;}");
    html += F(".s-title{font-size:15px;font-weight:700;color:#38bdf8;margin-bottom:8px;}");
    html += F(".raw-val{font-size:32px;font-weight:700;color:#22c55e;}");
    html += F(".label{color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-top:4px;}");
    html += F(".status-pill{display:inline-block;padding:4px 12px;border-radius:16px;background:#0284c7;color:#fff;font-weight:600;font-size:11px;margin-top:8px;}");
    html += F(".footer-stats{display:flex;justify-content:space-between;background:#0f172a;padding:10px 16px;border-radius:8px;border:1px solid #334155;font-size:13px;color:#94a3b8;}");
    html += F("</style></head><body>");
    html += F("<div class='card'>");
    html += F("<h1>ChairSense CD74HC4067</h1><div class='sub'>Live Quad FSR Telemetry (16-Ch MUX)</div>");
    html += F("<div class='sensor-grid'>");
    
    // FSR 1 (C0)
    html += F("<div class='sensor-box'><div class='s-title'>FSR 1 (Channel C0)</div>");
    html += F("<div class='raw-val' id='fsr1Val'>"); html += String(s1); html += F("</div>");
    html += F("<div class='label' id='fsr1Volt'>"); html += String(v1, 2); html += F(" V</div>");
    html += F("<div class='status-pill' id='fsr1Status'>"); html += SensorManager::getPressureDescription(s1); html += F("</div></div>");
    
    // FSR 2 (C1)
    html += F("<div class='sensor-box'><div class='s-title'>FSR 2 (Channel C1)</div>");
    html += F("<div class='raw-val' id='fsr2Val'>"); html += String(s2); html += F("</div>");
    html += F("<div class='label' id='fsr2Volt'>"); html += String(v2, 2); html += F(" V</div>");
    html += F("<div class='status-pill' id='fsr2Status'>"); html += SensorManager::getPressureDescription(s2); html += F("</div></div>");

    // FSR 3 (C2)
    html += F("<div class='sensor-box'><div class='s-title'>FSR 3 (Channel C2)</div>");
    html += F("<div class='raw-val' id='fsr3Val'>"); html += String(s3); html += F("</div>");
    html += F("<div class='label' id='fsr3Volt'>"); html += String(v3, 2); html += F(" V</div>");
    html += F("<div class='status-pill' id='fsr3Status'>"); html += SensorManager::getPressureDescription(s3); html += F("</div></div>");

    // FSR 4 (C3)
    html += F("<div class='sensor-box'><div class='s-title'>FSR 4 (Channel C3)</div>");
    html += F("<div class='raw-val' id='fsr4Val'>"); html += String(s4); html += F("</div>");
    html += F("<div class='label' id='fsr4Volt'>"); html += String(v4, 2); html += F(" V</div>");
    html += F("<div class='status-pill' id='fsr4Status'>"); html += SensorManager::getPressureDescription(s4); html += F("</div></div>");

    html += F("</div>");
    html += F("<div class='footer-stats'><span>WiFi RSSI: "); html += String(WiFiManager::getSignalStrength()); html += F(" dBm</span><span>Broker: broker.emqx.io</span></div>");
    html += F("<script>");
    html += F("setInterval(async()=>{try{const r=await fetch('/sensor');const d=await r.json();");
    html += F("document.getElementById('fsr1Val').innerText=d.fsr1_raw;document.getElementById('fsr1Volt').innerText=d.fsr1_voltage.toFixed(2)+' V';document.getElementById('fsr1Status').innerText=d.fsr1_status;");
    html += F("document.getElementById('fsr2Val').innerText=d.fsr2_raw;document.getElementById('fsr2Volt').innerText=d.fsr2_voltage.toFixed(2)+' V';document.getElementById('fsr2Status').innerText=d.fsr2_status;");
    html += F("document.getElementById('fsr3Val').innerText=d.fsr3_raw;document.getElementById('fsr3Volt').innerText=d.fsr3_voltage.toFixed(2)+' V';document.getElementById('fsr3Status').innerText=d.fsr3_status;");
    html += F("document.getElementById('fsr4Val').innerText=d.fsr4_raw;document.getElementById('fsr4Volt').innerText=d.fsr4_voltage.toFixed(2)+' V';document.getElementById('fsr4Status').innerText=d.fsr4_status;");
    html += F("}catch(e){}},300);");
    html += F("</script></div></body></html>");

    httpServer.send(200, F("text/html"), html);
}

void handleHttpSensor()
{
    int s1 = 0, s2 = 0, s3 = 0, s4 = 0;
    SensorManager::readAllSensors(s1, s2, s3, s4);

    String response = DeviceManager::getTelemetryPayload(s1, s2, s3, s4);
    httpServer.send(200, F("application/json"), response);
}

void handleHttpHealth()
{
    httpServer.send(200, F("application/json"), F("{\"health\":\"ok\"}"));
}

void handleHttpWifi()
{
    JsonDocument doc;
    doc["ssid"] = WiFiManager::getSSID();
    doc["ip"] = WiFiManager::getLocalIP();
    doc["rssi"] = String(WiFiManager::getSignalStrength());

    String response;
    serializeJson(doc, response);
    httpServer.send(200, F("application/json"), response);
}

void handleHttpNotFound()
{
    httpServer.send(404, F("application/json"), F("{\"error\":\"not_found\"}"));
}

// ==============================================================================
// Setup & Loop
// ==============================================================================
void setup()
{
    // 1. Serial Port Setup
    Serial.begin(115200);
    delay(250);
    Serial.println();
    Serial.println(F("========================================================"));
    Serial.println(F("    ChairSense ESP8266 + CD74HC4067 (4-Ch Active / 16-Ch MUX)"));
    Serial.println(F("========================================================"));

    // 2. Hardware Diagnostics
    DeviceManager::init();

    // 3. Status LED Setup
    pinMode(STATUS_LED_PIN, OUTPUT);
    digitalWrite(STATUS_LED_PIN, HIGH);

    // 4. Initialize Subsystems
    SensorManager::init();
    WiFiManager::init();

    // 5. Connect WiFi
    WiFiManager::connectWiFi();

    // 6. Setup HTTP Local Web Dashboard
    httpServer.on(F("/"), HTTP_GET, handleHttpRoot);
    httpServer.on(F("/sensor"), HTTP_GET, handleHttpSensor);
    httpServer.on(F("/health"), HTTP_GET, handleHttpHealth);
    httpServer.on(F("/wifi"), HTTP_GET, handleHttpWifi);
    httpServer.onNotFound(handleHttpNotFound);
    httpServer.begin();
    Serial.println(F("[HTTP] Web Dashboard running on port 80"));

    if (WiFiManager::isWiFiConnected())
    {
        Serial.println(F("\n========================================================"));
        Serial.println(F(" >>> WiFi Connected to: Samsung F23"));
        Serial.printf( " >>> Local Dashboard URL: http://%s/\n", WiFiManager::getLocalIP().c_str());
        Serial.printf( " >>> Live JSON Stream   : http://%s/sensor\n", WiFiManager::getLocalIP().c_str());
        Serial.println(F("========================================================\n"));
    }

    // 7. Initialize MQTT Subsystem
    MQTTManager::init(handleCommand);
    if (WiFiManager::isWiFiConnected())
    {
        MQTTManager::connectMQTT();
    }

    Serial.println(F("[System] ChairSense Firmware Running!\n"));
}

void loop()
{
    // 1. Maintain WiFi & MQTT
    WiFiManager::maintainWiFi();
    MQTTManager::maintainMQTT();

    // 2. Handle HTTP clients
    httpServer.handleClient();

    // 3. Periodic Live Quad Sensor Logging to Serial Port
    if (millis() - lastSerialLog >= SERIAL_LOG_INTERVAL_MS)
    {
        lastSerialLog = millis();
        int s1 = 0, s2 = 0, s3 = 0, s4 = 0;
        SensorManager::readAllSensors(s1, s2, s3, s4);
        float v1 = SensorManager::getVoltage(s1);
        float v2 = SensorManager::getVoltage(s2);
        float v3 = SensorManager::getVoltage(s3);
        float v4 = SensorManager::getVoltage(s4);
        const char* d1 = SensorManager::getPressureDescription(s1);
        const char* d2 = SensorManager::getPressureDescription(s2);
        const char* d3 = SensorManager::getPressureDescription(s3);
        const char* d4 = SensorManager::getPressureDescription(s4);

        Serial.printf("[MUX SENSORS] FSR1(C0): %4d (%.2fV - %s) | FSR2(C1): %4d (%.2fV - %s) | FSR3(C2): %4d (%.2fV - %s) | FSR4(C3): %4d (%.2fV - %s)\n",
                      s1, v1, d1, s2, v2, d2, s3, v3, d3, s4, v4, d4);
    }

    // 4. Periodic Telemetry Publish to MQTT (Every 500ms)
    if (millis() - lastTelemetryPublish >= TELEMETRY_INTERVAL_MS)
    {
        lastTelemetryPublish = millis();

        if (MQTTManager::isMQTTConnected())
        {
            int s1 = 0, s2 = 0, s3 = 0, s4 = 0;
            SensorManager::readAllSensors(s1, s2, s3, s4);
            MQTTManager::publishTelemetry(s1, s2, s3, s4);
        }
    }

    // 5. Periodic RSSI Logging
    if (millis() - lastRssiLog >= RSSI_LOG_INTERVAL_MS)
    {
        lastRssiLog = millis();
        if (WiFiManager::isWiFiConnected())
        {
            Serial.printf("[Telemetry] RSSI: %d dBm | IP: %s | MQTT: %s\n", 
                          WiFiManager::getSignalStrength(),
                          WiFiManager::getLocalIP().c_str(),
                          MQTTManager::isMQTTConnected() ? "CONNECTED" : "DISCONNECTED");
        }
    }

    // 6. Visual Status LED Indicator
    if (WiFiManager::isWiFiConnected() && MQTTManager::isMQTTConnected())
    {
        if (millis() - lastLedToggle >= 500)
        {
            lastLedToggle = millis();
            ledState = !ledState;
            digitalWrite(STATUS_LED_PIN, ledState ? LOW : HIGH);
        }
    }
    else
    {
        if (millis() - lastLedToggle >= 150)
        {
            lastLedToggle = millis();
            ledState = !ledState;
            digitalWrite(STATUS_LED_PIN, ledState ? LOW : HIGH);
        }
    }
}