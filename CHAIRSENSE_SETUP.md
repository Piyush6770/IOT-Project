# ChairSense IoT Integration Runbook & Setup Guide

**Full Project Title:** ChairSense: A Removable IoT Device for Posture Monitoring and Sedentary Behaviour Analysis  
**Device ID:** `CHAIR001`  
**Firmware Architecture:** ESP8266 NodeMCU v3 + CD74HC4067 16-Channel Analog Multiplexer  

---

## 1. Required Hardware & Components

1. **ESP8266 NodeMCU v3** (ESP-12E / 4MB Flash)
2. **CD74HC4067** 16-channel analog multiplexer breakout module
3. **Four (4) FSR402** force-sensitive resistor sensors
4. **Four (4) 10 kΩ resistors** (pull-down resistors for voltage divider networks)
5. **Breadboard** and high-grade male-to-male & male-to-female jumper wires
6. **Micro-USB cable** with data lines (for programming & serial monitoring at 115200 baud)
7. *(Optional)* RGB LED with 220 Ω resistors and/or 5V/3.3V active buzzer

---

## 2. Verified Hardware Pinout & Wiring Table

### A. CD74HC4067 Multiplexer to ESP8266 NodeMCU

| CD74HC4067 Pin | NodeMCU v3 Pin | ESP8266 GPIO | Description / Signal |
|:---|:---|:---|:---|
| **VCC** | 3V3 | 3.3V Rail | Logic & Sensor Supply |
| **GND** | GND | Ground Rail | Common System Ground |
| **EN** | GND | Ground | Active LOW (tied to GND to enable MUX) |
| **SIG / COM** | **A0** | ADC0 | Analog output into ESP8266 ADC |
| **S0** | **D1** | GPIO5 | 4-bit Channel Address Bit 0 |
| **S1** | **D2** | GPIO4 | 4-bit Channel Address Bit 1 |
| **S2** | **D5** | GPIO14 | 4-bit Channel Address Bit 2 |
| **S3** | **D6** | GPIO12 | 4-bit Channel Address Bit 3 |

> [!IMPORTANT]
> **A0 Input Voltage Limit**: The NodeMCU v3 board includes an onboard resistor divider (220 kΩ / 100 kΩ) scaling external 0–3.3 V inputs down to the bare ESP8266 0–1.0 V ADC range. Powering the FSR dividers from NodeMCU 3.3 V produces a safe 0–3.3 V signal on A0. Never connect 5V to the analog input or sensor dividers!

### B. FSR402 Sensor Channel Mapping

Each FSR402 uses an independent voltage divider:
```text
  3.3V Rail
     |
  [FSR402]
     |
     +-----------> CD74HC4067 Channel Pin (C0 - C3)
     |
  [10 kΩ Resistor]
     |
    GND
```

| Sensor Name | Physical Chair Location | Firmware Key | MUX Channel | MUX Address (S3 S2 S1 S0) |
|:---|:---|:---|:---|:---|
| **FSR 1** | Seat Cushion - Left | `seat_left` / `pressure1` | **C0** | `0 0 0 0` |
| **FSR 2** | Seat Cushion - Right | `seat_right` / `pressure2` | **C1** | `0 0 0 1` |
| **FSR 3** | Backrest - Left | `back_left` / `pressure3` | **C2** | `0 0 1 0` |
| **FSR 4** | Backrest - Right | `back_right` / `pressure4` | **C3** | `0 0 1 1` |

### C. Active Alert Actuators (Common-Cathode RGB LED)

For a **common-cathode RGB LED**, with one 220–330 Ω current-limiting resistor per color terminal:

| RGB LED Terminal | NodeMCU Connection | ESP8266 GPIO | Description & Current-Limiting |
|:---|:---|:---|:---|
| **Red (Anode)** | **D7** | GPIO13 | Through 220–330 Ω resistor |
| **Green (Anode)** | **D0** | GPIO16 | Through 220–330 Ω resistor |
| **Blue (Anode)** | **D4** | GPIO2 | Through 220–330 Ω resistor |
| **Common Cathode** | **GND** | GND | Common System Ground |

#### Automated Occupancy & Sedentary Alert Behavior:
1. **Chair Vacant / Empty:** RGB LED is **OFF**.
2. **Person Sits on Chair:** **GREEN** light glows immediately (seated timer starts).
3. **10 Seconds Continuous Sitting Exceeded:** Automatically transitions from Green to glowing **RED** light.
4. **Person Stands Up (Break Taken):** Light turns **OFF** immediately and the 10-second timer resets back to 0. When they sit down again, it starts fresh with Green for 10 seconds!

To customize the delay, adjust `OCCUPANCY_ALERT_DELAY_MS` in `firmware/ChairSense/include/config.h`:
```cpp
constexpr unsigned long OCCUPANCY_ALERT_DELAY_MS = 10000; // 10,000ms = 10 seconds
```

---

---

## 3. Direct Laptop Wi-Fi Connection (ESP8266 Access Point Mode)

The ESP8266 broadcasts its own Wi-Fi Hotspot directly, eliminating the need for an external router or internet connection!

### Hotspot Network Details
- **Wi-Fi Network Name (SSID):** `ChairSense-WiFi`
- **Wi-Fi Password:** `chairsense123`
- **ESP8266 Hotspot IP Address:** `192.168.4.1`

### How to Connect Your Laptop & View Live Dashboard
1. Power the ESP8266 NodeMCU using a USB cable or power bank.
2. On your Windows laptop, open your **Wi-Fi settings** (click the Wi-Fi icon in the taskbar).
3. Select **`ChairSense-WiFi`** and click **Connect**.
4. Enter the password: **`chairsense123`**.
5. Once connected, open your browser and navigate to either:
   - **Localhost React Dashboard:** [http://localhost:5173/live](http://localhost:5173/live)  
     *(Automatically streams live sensor data from `http://192.168.4.1/sensor` through the `/esp/sensor` proxy!)*
   - **Direct ESP8266 Hardware Webpage:** [http://192.168.4.1/](http://192.168.4.1/)
   - **Direct JSON Endpoint:** [http://192.168.4.1/sensor](http://192.168.4.1/sensor)

*(Optional) If you also want the ESP to connect to your home Wi-Fi in parallel, edit `firmware/ChairSense/include/config.h`:*
```cpp
constexpr char WIFI_SSID[] = "YOUR_WIFI_SSID";
constexpr char WIFI_PASSWORD[] = "YOUR_WIFI_PASSWORD";
```

---

## 4. Starting the Services

### Step 1: Start Backend (FastAPI + MQTT Ingestion)

Open a terminal in `backend/`:
```powershell
cd c:\Users\piyus\IOT\backend
..\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)
- MQTT Bridge Status: [http://localhost:8000/mqtt/status](http://localhost:8000/mqtt/status)
- Live Device Telemetry: [http://localhost:8000/device/CHAIR001](http://localhost:8000/device/CHAIR001)

### Step 2: Start Frontend (React + Vite)

Open another terminal in `frontend/`:
```powershell
cd c:\Users\piyus\IOT\frontend
npm run dev
```
- React Dashboard URL: **[http://localhost:5173/](http://localhost:5173/)**
- Direct Live Monitor URL: **[http://localhost:5173/live](http://localhost:5173/live)**

---

## 5. Building & Uploading Firmware

### Step 1: Compile Firmware
In the root directory or in `firmware/ChairSense`:
```powershell
cd c:\Users\piyus\IOT\firmware\ChairSense
pio run
```

### Step 2: Upload to ESP8266
1. Plug the ESP8266 NodeMCU into your laptop using a micro-USB cable.
2. Identify your COM port (in Device Manager or PowerShell: `[System.IO.Ports.SerialPort]::getportnames()`).
3. If your port differs from `COM9`, specify `--upload-port`:
```powershell
pio run --target upload --upload-port COM9
```

### Step 3: Serial Monitor
```powershell
pio device monitor --port COM9 --baud 115200
```
Upon startup, the firmware prints:
- Chip diagnostics & MAC address
- Wi-Fi connection status and assigned LAN IP address
- Local HTTP Web Dashboard URL: `http://<ESP8266_IP>/`
- Live JSON endpoint: `http://<ESP8266_IP>/sensor`
- Periodic quad-sensor ASCII bar graph logs

---

## 6. Verifying Actual Sensor Data

1. **Local Diagnostic Webpage:** Open `http://<ESP8266_IP>/` in your browser. The embedded ESP8266 HTTP server serves a dark-mode real-time dashboard displaying FSR 1–4 RAW values, voltages, and pressure labels.
2. **REST API Endpoint:** Query `http://localhost:8000/api/v1/sensor/latest?chair=CHAIR001`.
3. **WebSocket Stream:** The React dashboard connects to `ws://localhost:5173/ws/live` via the Vite proxy, streaming real-time pressure curves and heatmap updates.
4. **Physical Touch Verification:**
   - Press **FSR 1** (Seat Left): FSR1 jumps from `0` to `200-800` RAW counts. Dashboard highlights the left front cushion.
   - Press **FSR 2** (Seat Right): FSR2 jumps. Heatmap highlights the right front cushion.
   - Press **FSR 3** (Back Left): FSR3 jumps. Backrest left quadrant activates.
   - Press **FSR 4** (Back Right): FSR4 jumps. Backrest right quadrant activates.
5. **Occupancy & Sedentary Timer:**
   - When sitting, occupancy becomes `CHAIR OCCUPIED` and continuous sitting time starts accumulating.
   - When standing up, occupancy transitions to `CHAIR EMPTY` and sitting timer pauses.
   - If continuous sitting exceeds 45 minutes, a warning banner appears reminding you to take a stretch break.

---

## 7. Troubleshooting & Common Issues

| Issue | Root Cause | Solution |
|:---|:---|:---|
| **All FSR readings read 0 or 1023 continuously** | Missing ground or floating A0 line | Ensure CD74HC4067 SIG pin connects to NodeMCU A0, EN pin connects to GND, and 10 kΩ pull-down resistors are grounded. |
| **Wi-Fi will not connect** | 5 GHz network or wrong SSID | NodeMCU v3 only supports 2.4 GHz Wi-Fi. Connect to a 2.4 GHz hotspot/router. |
| **Backend reports MQTT Disconnected** | Blocked port 1883 on network | Ensure firewall allows outbound TCP port 1883 to `broker.emqx.io`. |
| **Dashboard shows 401 Unauthorized** | Expired/absent JWT token | Log in via `/login` with `alex.morgan@healthiot.org` / `smartchair2026` or use default seeded credentials. |
| **Serial monitor shows garbage characters** | Incorrect baud rate | Set serial monitor to `115200` baud. |
