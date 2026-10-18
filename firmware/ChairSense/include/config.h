#ifndef CHAIRSENSE_CONFIG_H
#define CHAIRSENSE_CONFIG_H

#include <Arduino.h>

// ==============================================================================
// WiFi Station Configuration (Connects to existing router/hotspot)
// ==============================================================================
constexpr char WIFI_SSID[] = "Samsung F23";
constexpr char WIFI_PASSWORD[] = "30042006";

constexpr unsigned long WIFI_CONNECT_TIMEOUT_MS = 10000;
constexpr unsigned long WIFI_RECONNECT_INTERVAL_MS = 5000;

// ==============================================================================
// WiFi Access Point (AP Mode) Configuration - Direct Laptop WiFi Connection
// The ESP8266 broadcasts this network so you can connect your laptop directly!
// ==============================================================================
constexpr bool WIFI_AP_MODE_ENABLED = true;
constexpr char WIFI_AP_SSID[] = "ChairSense-WiFi";
constexpr char WIFI_AP_PASSWORD[] = "chairsense123"; // 8+ characters for WPA2 PSK
constexpr uint8_t WIFI_AP_CHANNEL = 1;
constexpr bool WIFI_AP_HIDDEN = false;
constexpr uint8_t WIFI_AP_MAX_CONN = 4;
constexpr char WIFI_AP_IP[] = "192.168.4.1";

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
constexpr unsigned long TELEMETRY_INTERVAL_MS = 3000; // Live MQTT telemetry rate (3000ms)
constexpr unsigned long SERIAL_LOG_INTERVAL_MS = 3000; // Serial monitor output interval (3000ms)
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

// Sensor Channel Mapping on CD74HC4067 (Authoritative Project Pinout)
// FSR1: Seat Left  -> Channel C0 (Address: 0000)
// FSR2: Seat Right -> Channel C1 (Address: 0001)
// FSR3: Back Left  -> Channel C2 (Address: 0010)
// FSR4: Back Right -> Channel C3 (Address: 0011)
constexpr uint8_t MUX_CH_FSR1 = 0; // Channel C0 -> FSR 1 (seat_left)
constexpr uint8_t MUX_CH_FSR2 = 1; // Channel C1 -> FSR 2 (seat_right)
constexpr uint8_t MUX_CH_FSR3 = 2; // Channel C2 -> FSR 3 (back_left)
constexpr uint8_t MUX_CH_FSR4 = 3; // Channel C3 -> FSR 4 (back_right)

// Sensor Thresholds & Filtering
constexpr int OCCUPANCY_RAW_THRESHOLD = 30; // Min ADC reading to register chair occupancy
constexpr int NOISE_FLOOR_ADC = 10;          // ADC noise cutoff floor

// ==============================================================================
// Alert & Actuator Pin Definitions (RGB LED & Active Buzzer)
// Authoritative Pinout for Common-Cathode RGB LED:
// - Red LED         : D7 (GPIO13) through 220-330 ohm resistor
// - Green LED       : D0 (GPIO16) through 220-330 ohm resistor
// - Blue LED        : D4 (GPIO2)  through 220-330 ohm resistor
// - Common Cathode  : GND
// ==============================================================================
constexpr bool BUZZER_ENABLED = false;   // Buzzer disabled when using D7 for Red LED
constexpr uint8_t BUZZER_PIN = D8;       // GPIO15 (Alternate pin if buzzer is ever attached)

constexpr bool RGB_LED_ENABLED = true;   // Common-Cathode RGB LED enabled
constexpr uint8_t LED_RED_PIN = D7;      // GPIO13 (Red pin per user schematic)
constexpr uint8_t LED_GREEN_PIN = D0;    // GPIO16 (Green pin per user schematic)
constexpr uint8_t LED_BLUE_PIN = D4;     // GPIO2  (Blue pin per user schematic)

// Occupancy Alert Timing: Green for 10s of continuous sitting, then Red
constexpr unsigned long OCCUPANCY_ALERT_DELAY_MS = 10000; // 10,000ms (10 seconds)

#endif // CHAIRSENSE_CONFIG_H