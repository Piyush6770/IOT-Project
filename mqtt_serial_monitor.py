#!/usr/bin/env python3
"""
ChairSense Wireless MQTT Dual-Sensor Live Monitor
Receives real-time telemetry from ESP8266 + CD74HC4067 (16-Ch MUX) over MQTT (broker.emqx.io).
"""

import sys
import json
from datetime import datetime

try:
    import paho.mqtt.client as mqtt
except ImportError:
    print("Error: 'paho-mqtt' library is required. Install with: pip install paho-mqtt")
    sys.exit(1)

BROKER_HOST = "broker.emqx.io"
BROKER_PORT = 1883
TOPIC_SENSOR = "smartchair/chair001/sensors"
TOPIC_STATUS = "smartchair/chair001/status"
TOPIC_REGISTRATION = "smartchair/chair001/registration"

def make_bar(percent, width=10):
    filled = int((percent / 100.0) * width)
    filled = max(0, min(width, filled))
    return "#" * filled + "-" * (width - filled)

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("\n" + "=" * 78, flush=True)
        print("  [OK] CONNECTED TO MQTT BROKER (broker.emqx.io:1883)", flush=True)
        print(f"  [OK] Telemetry Topic : {TOPIC_SENSOR}", flush=True)
        print(f"  [OK] Status Topic    : {TOPIC_STATUS}", flush=True)
        print("  [OK] Listening for CD74HC4067 Dual FSR Wireless Telemetry...", flush=True)
        print("=" * 78 + "\n", flush=True)
        print(f"{'TIME':<10} | {'FSR 1 (C0) RAW':<15} | {'V1':<6} | {'FSR 1 BAR':<12} | {'FSR 2 (C1) RAW':<15} | {'V2':<6} | {'FSR 2 BAR':<12} | {'RSSI'}", flush=True)
        print("-" * 105, flush=True)
        client.subscribe([(TOPIC_SENSOR, 0), (TOPIC_STATUS, 0), (TOPIC_REGISTRATION, 0)])
    else:
        print(f"[MQTT] Connection failed with result code: {rc}", flush=True)

def on_message(client, userdata, msg):
    now_str = datetime.now().strftime("%H:%M:%S")
    raw_payload = msg.payload.decode('utf-8', errors='ignore')

    if msg.topic == TOPIC_STATUS:
        print(f"[{now_str}] [STATUS UPDATE] {raw_payload}", flush=True)
        return

    if msg.topic == TOPIC_REGISTRATION:
        print(f"[{now_str}] [DEVICE REGISTERED] {raw_payload}", flush=True)
        return

    try:
        data = json.loads(raw_payload)
        
        # FSR 1 (Channel C0)
        s1_raw = data.get("fsr1_raw", data.get("pressure1", data.get("raw", 0)))
        s1_volt = data.get("fsr1_voltage", (s1_raw * 3.3) / 1023.0)
        s1_pct = data.get("fsr1_percent", int((s1_raw * 100) / 1023))
        
        # FSR 2 (Channel C1)
        s2_raw = data.get("fsr2_raw", data.get("pressure2", 0))
        s2_volt = data.get("fsr2_voltage", (s2_raw * 3.3) / 1023.0)
        s2_pct = data.get("fsr2_percent", int((s2_raw * 100) / 1023))
        
        rssi = data.get("rssi", data.get("wifi", 0))

        bar1 = make_bar(s1_pct, width=10)
        bar2 = make_bar(s2_pct, width=10)

        print(f"[{now_str}] | C0: {s1_raw:4d}/1023 | {s1_volt:4.2f}V | [{bar1}] | C1: {s2_raw:4d}/1023 | {s2_volt:4.2f}V | [{bar2}] | {rssi:3d} dBm", flush=True)
        
    except json.JSONDecodeError:
        print(f"[{now_str}] [RAW MQTT] {msg.topic} -> {raw_payload}", flush=True)

def main():
    print("\n" + "#" * 78, flush=True)
    print("      CHAIRSENSE CD74HC4067 DUAL FSR LIVE WIRELESS MONITOR (MQTT)       ")
    print("#" * 78, flush=True)
    print(f"Connecting to broker: {BROKER_HOST}:{BROKER_PORT} ...", flush=True)

    try:
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="ChairSense-DualSensor-Monitor")
    except (AttributeError, TypeError):
        client = mqtt.Client(client_id="ChairSense-DualSensor-Monitor")

    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(BROKER_HOST, BROKER_PORT, 60)
        client.loop_forever()
    except KeyboardInterrupt:
        print("\n[MQTT Monitor] Stopped by user.", flush=True)
    except Exception as e:
        print(f"\n[MQTT Monitor] Error: {e}", flush=True)

if __name__ == "__main__":
    main()
