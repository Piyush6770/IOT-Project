#ifndef CHAIRSENSE_CONFIG_H
#define CHAIRSENSE_CONFIG_H

// TODO: Replace every placeholder before flashing the device.
// Keep this file out of shared repositories because it contains credentials.

// WiFi configuration
constexpr char WIFI_SSID[] = "YOUR_WIFI_SSID";
constexpr char WIFI_PASSWORD[] = "YOUR_WIFI_PASSWORD";

// MQTT broker configuration. Public HiveMQ test broker for initial verification.
// Replace with your private broker before production use.
constexpr char MQTT_BROKER_HOST[] = "broker.hivemq.com";
constexpr uint16_t MQTT_BROKER_PORT = 1883;
constexpr char MQTT_USERNAME[] = "";
constexpr char MQTT_PASSWORD[] = "";
constexpr char MQTT_CLIENT_ID[] = "chairsense-esp8266";

// TODO: Use topic names that match the Node-RED MQTT nodes.
constexpr char MQTT_SENSOR_TOPIC[] = "chairsense/esp8266/sensor";
constexpr char MQTT_STATUS_TOPIC[] = "chairsense/esp8266/status";
constexpr char MQTT_COMMAND_TOPIC[] = "chairsense/esp8266/command";

#endif