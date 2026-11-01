# ChairSense – Final Hardware Connections

## 1. ESP8266 NodeMCU to CD74HC4067 Multiplexer

| NodeMCU pin | CD74HC4067 pin |
| ----------- | -------------- |
| 3V3         | VCC            |
| GND         | GND            |
| GND         | EN             |
| A0          | SIG / COM      |
| D1 (GPIO5)  | S0             |
| D2 (GPIO4)  | S1             |
| D5 (GPIO14) | S2             |
| D6 (GPIO12) | S3             |

## 2. FSR402 Sensors to Multiplexer

Each sensor requires one separate 10 kΩ resistor.

| Sensor                | FSR terminal 1 | FSR terminal 2 / output junction | Output junction to multiplexer |
| --------------------- | -------------- | -------------------------------- | ------------------------------ |
| FSR1 – Seat Left      | 3V3            | 10 kΩ resistor and C0            | C0                             |
| FSR2 – Seat Right     | 3V3            | 10 kΩ resistor and C1            | C1                             |
| FSR3 – Backrest Left  | 3V3            | 10 kΩ resistor and C2            | C2                             |
| FSR4 – Backrest Right | 3V3            | 10 kΩ resistor and C3            | C3                             |

For every sensor:

- One FSR terminal → 3V3.
- Other FSR terminal → output junction.
- Output junction → corresponding multiplexer channel.
- Output junction → one end of its 10 kΩ resistor.
- Other end of 10 kΩ resistor → GND.

4 separate voltage dividers

## 3. RGB LED Connections

For a common-cathode RGB LED:

| RGB LED terminal | NodeMCU connection            |
| ---------------- | ----------------------------- |
| Red anode        | D7 (GPIO13) through 220–330 Ω |
| Green anode      | D0 (GPIO16) through 220–330 Ω |
| Blue anode       | D4 (GPIO2) through 220–330 Ω  |
| Common cathode   | GND                           |

Use one resistor per colour.

Important: GPIO2 is a boot-strap pin. Ensure the LED circuit does not pull it LOW during startup. Verify booting before finalizing this connection.

## 4. Buzzer Connections

For a compatible low-current, 3.3 V active buzzer, use a transistor driver:

| Component            | Connection                                     |
| -------------------- | ---------------------------------------------- |
| NodeMCU D3 (GPIO0)   | Transistor base through suitable base resistor |
| Transistor emitter   | GND                                            |
| Transistor collector | Buzzer negative                                |
| Buzzer positive      | Suitable positive supply                       |
| NodeMCU GND          | Common GND                                     |

Use a suitable NPN transistor, such as BC547, if its ratings match the buzzer. Add a flyback diode across the buzzer if it is an inductive load.

Important: GPIO0 is a boot-strap pin. Do not use this assignment unless the driver circuit guarantees GPIO0 is not pulled LOW during startup. Prefer a verified non-strap GPIO if available.

## 5. Power Supply Connections

| Component                 | Power connection                 |
| ------------------------- | -------------------------------- |
| NodeMCU                   | USB power bank through USB cable |
| CD74HC4067 VCC            | NodeMCU 3V3                      |
| Four FSR voltage dividers | NodeMCU 3V3                      |
| Four 10 kΩ resistors      | Common GND                       |
| Multiplexer GND           | Common GND                       |
| RGB LED common cathode    | GND                              |
| Buzzer driver GND         | Common GND                       |

## 6. Complete Multiplexer Channel Mapping

| Multiplexer channel | Sensor                |
| ------------------- | --------------------- |
| C0                  | FSR1 – Seat Left      |
| C1                  | FSR2 – Seat Right     |
| C2                  | FSR3 – Backrest Left  |
| C3                  | FSR4 – Backrest Right |

## 7. Final NodeMCU Pin Summary

| NodeMCU pin | Connected component                                        |
| ----------- | ---------------------------------------------------------- |
| 3V3         | Multiplexer VCC and all four FSR dividers                  |
| GND         | Common ground                                              |
| A0          | Multiplexer SIG/COM                                        |
| D1          | Multiplexer S0                                             |
| D2          | Multiplexer S1                                             |
| D5          | Multiplexer S2                                             |
| D6          | Multiplexer S3                                             |
| D7          | RGB Red through resistor                                   |
| D0          | RGB Green through resistor                                 |
| D4          | RGB Blue through resistor                                  |
| D3          | Buzzer driver control, only after boot-safety verification |

Before powering on: Verify your NodeMCU A0 input voltage limit. Some boards accept up to approximately 3.3 V at A0, while a bare ESP8266 ADC does not. Also verify the buzzer driver and GPIO startup behaviour.
