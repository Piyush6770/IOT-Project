# ChairSense ESP8266 WiFi Verification

This firmware verifies the network path:

`ESP8266 -> WiFi router -> laptop`

MQTT uses `knolleary/PubSubClient` and publishes a sample JSON value every five seconds to `chairsense/esp8266/sensor`.

## Configure WiFi

Edit `include/config.h` and replace the placeholders:

```cpp
const char *WIFI_SSID = "YOUR_WIFI_SSID";
const char *WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
```

Also set `MQTT_BROKER_HOST` to the laptop's LAN IP address or broker hostname. Do not use `localhost` or `127.0.0.1`, because those addresses would point back to the ESP8266.

The ESP8266 must connect to a 2.4 GHz WiFi network. Keep the laptop on the same network. The credentials are compile-time constants for this hardware test and should not be committed to a shared repository.

## MQTT and Node-RED setup checklist

1. Install an MQTT broker, such as Mosquitto, on the laptop or use a hosted MQTT service.
2. Record the broker hostname/IP, port (normally `1883`), username, and password.
3. Update the MQTT fields in `include/config.h`.
4. Start Node-RED and add an MQTT input node connected to the same broker.
5. Configure the input node for topic `chairsense/esp8266/sensor`.
6. Add a JSON node and dashboard/chart nodes to display `msg.payload.sensorValue`.
7. Optionally subscribe to `chairsense/esp8266/status` to monitor device status.

## PlatformIO configuration

`platformio.ini` contains the required environment:

```ini
[env:nodemcuv2]
platform = espressif8266
board = nodemcuv2
framework = arduino
monitor_speed = 115200
```

It also currently selects `COM9` for upload and monitoring. Change both `upload_port` and `monitor_port` if Windows assigns a different COM port.

## Upload instructions

1. Connect the ESP8266 NodeMCU to the laptop with a data-capable USB cable.
2. Replace the WiFi constants and save the file.
3. In VS Code, open the ChairSense folder.
4. Open PlatformIO in the left activity bar and select **Build** to compile.
5. Select **Upload** to flash the board.
6. Equivalent terminal command from this folder:

```powershell
& "C:\Users\piyus\.platformio\penv\Scripts\platformio.exe" run -e nodemcuv2 --target upload
```

If the upload task reports a different port, update `upload_port` in `platformio.ini` or pass it temporarily:

```powershell
& "C:\Users\piyus\.platformio\penv\Scripts\platformio.exe" run -e nodemcuv2 --target upload --upload-port COM<number>
```

## Serial Monitor instructions

1. Open PlatformIO **Serial Monitor** after upload.
2. Set the baud rate to `115200`.
3. Equivalent terminal command:

```powershell
& "C:\Users\piyus\.platformio\penv\Scripts\platformio.exe" device monitor -e nodemcuv2 --baud 115200
```

Expected output includes:

```text
Connecting to WiFi...
Connected!
IP Address: 192.168.x.x
[HTTP] Web server listening on port 80
Open browser:
http://192.168.x.x
RSSI: -45 dBm
```

The dots during connection are progress output. The actual RSSI depends on distance and interference. The built-in LED is on while disconnected and turns off while WiFi is connected; this is normal for the NodeMCU's active-low LED.

## HTTP endpoint

When the serial monitor prints the address, open it from the laptop browser:

```text
http://<ESP_IP>/
```

Expected response:

```json
{"device":"ESP8266","status":"online","ip":"192.168.x.x"}
```

The server listens on port 80. No MQTT connection is made by this firmware.

## Verification procedure

1. Upload the firmware.
2. Open the serial monitor at `115200` baud.
3. Verify that an IP address is printed after `Connected!`.
4. Open the printed URL in the laptop browser.
5. Verify the JSON response contains `device`, `status`, and the current IP.
6. Temporarily disable and re-enable the router WiFi, or move the board out of range and back. Verify logs show a disconnection and reconnection attempt, the LED returns to its connected state, and the endpoint becomes reachable again.

## Troubleshooting checklist

### COM port not found

- Open Windows **Device Manager > Ports (COM & LPT)**.
- Disconnect and reconnect the board and identify the newly appearing COM port.
- Update `upload_port` and `monitor_port` in `platformio.ini`.
- Close Arduino Serial Monitor or any other application holding the port.
- Use a known data-capable USB cable and a different USB port.

### CH340 driver issues

- Many NodeMCU boards use a CH340/CH341 USB-to-serial chip.
- If no COM port appears or Device Manager shows an unknown USB device, install the current WCH CH340/CH341 Windows driver.
- Reconnect the board and confirm a COM port appears before uploading.

### Upload failures

- Press the NodeMCU `FLASH` button while starting upload if the board does not enter bootloader mode automatically.
- Try a shorter or known-good USB cable.
- Confirm the selected board is `nodemcuv2`.
- Close the serial monitor before uploading.
- Verify the selected COM port is the board's port.
- Press `RST` after a failed upload and retry.

### WiFi connection failures

- Confirm the SSID and password constants exactly match the network.
- Use a 2.4 GHz network; ESP8266 does not connect to 5 GHz-only networks.
- Check that the router is not hiding or filtering the SSID and that MAC filtering is disabled for testing.
- Keep the board close to the router during first verification.
- Read the `[WiFi] Connection failure` status code in the serial log.
- Confirm the router has available DHCP addresses.

### Browser or firewall access failures

- Ensure the laptop and ESP8266 are on the same WiFi network and subnet.
- Use the IP printed by the ESP8266, not the laptop's IP address.
- Try `ping <ESP_IP>` from PowerShell.
- Temporarily allow PlatformIO/your browser on the Windows private-network firewall profile for testing.
- Confirm the URL is `http://`, not `https://`, and uses port 80.
- Guest WiFi or client-isolation mode can block laptop-to-device traffic; use the primary network or disable client isolation for testing.

## Future integration hooks

The WiFi boundary is intentionally isolated in `src/wifi_manager.cpp` and exposed in `src/wifi_manager.h`:

- `connectWiFi()` performs initial connection and IP logging.
- `maintainWiFi()` keeps the connection alive and retries after disconnection.
- `getLocalIP()` returns the current local address.

MQTT can be added later in a separate module after this HTTP verification succeeds.
