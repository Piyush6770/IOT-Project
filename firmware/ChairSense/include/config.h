#ifndef CHAIRSENSE_CONFIG_H
#define CHAIRSENSE_CONFIG_H

#include <Arduino.h>

// ==============================================================================
// WiFi Configuration
// ==============================================================================
constexpr char WIFI_SSID[] = "Samsung F23";
constexpr char WIFI_PASSWORD[] = "30042006";

constexpr unsigned long WIFI_CONNECT_TIMEOUT_MS = 25000;
constexpr unsigned long WIFI_RECONNECT_INTERVAL_MS = 5000;

// ==============================================================================
// Device Identification
// ==============================================================================
constexpr char DEVICE_ID[] = "CHAIR001";
constexpr char FIRMWARE_VERSION[] = "1.0.0";
constexpr char HARDWARE_MODEL[] = "ESP8266-NodeMCU-v3-CD74HC4067";

// ==============================================================================
// MQTT Broker Configuration
// ==============================================================================
constexpr char MQTT_BROKER_HOST[] = "broker.emqx.io";
constexpr uint16_t MQTT_BROKER_PORT = 1883;
constexpr char MQTT_CLIENT_ID[] = "CHAIR001";
constexpr char MQTT_USERNAME[] = "";
constexpr char MQTT_PASSWORD[] = "";
constexpr uint16_t MQTT_KEEPALIVE_SEC = 60;
constexpr unsigned long MQTT_RECONNECT_INTERVAL_MS = 5000;

// MQTT Topics
constexpr char MQTT_SENSOR_TOPIC[] = "smartchair/chair001/sensors";
constexpr char MQTT_COMMAND_TOPIC[] = "smartchair/chair001/commands";
constexpr char MQTT_STATUS_TOPIC[] = "smartchair/chair001/status";
constexpr char MQTT_REGISTRATION_TOPIC[] = "smartchair/chair001/registration";

// ==============================================================================
// Telemetry & Timing Configuration
// ==============================================================================
constexpr unsigned long TELEMETRY_INTERVAL_MS = 500; // Live MQTT telemetry rate (500ms)
constexpr unsigned long RSSI_LOG_INTERVAL_MS = 10000; // Periodic RSSI log interval

// ==============================================================================
// Hardware Pin Definitions (NodeMCU V3 & CD74HC4067 16-Ch Multiplexer)
// ==============================================================================
constexpr uint8_t STATUS_LED_PIN = LED_BUILTIN; // GPIO2 (Active LOW)

// CD74HC4067 4-Bit Channel Select Address Pins
constexpr uint8_t MUX_PIN_S0 = D1; // GPIO5
constexpr uint8_t MUX_PIN_S1 = D2; // GPIO4
constexpr uint8_t MUX_PIN_S2 = D5; // GPIO14
constexpr uint8_t MUX_PIN_S3 = D6; // GPIO12

// Analog Input Pin connected to MUX SIG (COM) Output
constexpr uint8_t MUX_ANALOG_PIN = A0; // ADC0 (0-3.3V mapped 0-1023)

// Sensor Channel Mapping on CD74HC4067
constexpr uint8_t MUX_CH_FSR1 = 0; // Channel C0 -> FSR 1
constexpr uint8_t MUX_CH_FSR2 = 1; // Channel C1 -> FSR 2
constexpr uint8_t MUX_CH_FSR3 = 2; // Channel C2 -> FSR 3
constexpr uint8_t MUX_CH_FSR4 = 3; // Channel C3 -> FSR 4

#endif // CHAIRSENSE_CONFIG_H