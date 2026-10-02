#include "sensor_manager.h"
#include "config.h"

void SensorManager::init()
{
    Serial.println(F("[Sensors] Initializing CD74HC4067 16-Channel Multiplexer..."));
    
    // Set 4 address select pins as digital outputs
    pinMode(MUX_PIN_S0, OUTPUT);
    pinMode(MUX_PIN_S1, OUTPUT);
    pinMode(MUX_PIN_S2, OUTPUT);
    pinMode(MUX_PIN_S3, OUTPUT);

    // Default to Channel C0
    selectMuxChannel(0);
    Serial.printf("[Sensors] Address Pins: S0=D1(GPIO5), S1=D2(GPIO4), S2=D5(GPIO14), S3=D6(GPIO12), Signal Pin=A0\n");
}

void SensorManager::selectMuxChannel(uint8_t channel)
{
    // CD74HC4067 4-bit binary address selection (0 - 15)
    digitalWrite(MUX_PIN_S0, (channel & 0x01) ? HIGH : LOW);
    digitalWrite(MUX_PIN_S1, (channel & 0x02) ? HIGH : LOW);
    digitalWrite(MUX_PIN_S2, (channel & 0x04) ? HIGH : LOW);
    digitalWrite(MUX_PIN_S3, (channel & 0x08) ? HIGH : LOW);
    
    // Settling time for analog switch capacitance
    delayMicroseconds(20);
}

int SensorManager::readChannel(uint8_t channel)
{
    selectMuxChannel(channel);
    
    // Discard first sample to allow ADC sample-and-hold circuit to settle
    analogRead(MUX_ANALOG_PIN);
    delayMicroseconds(10);

    // Multi-sample averaging (4 samples) to filter high-frequency noise
    int sum = 0;
    for (int i = 0; i < 4; i++)
    {
        sum += analogRead(MUX_ANALOG_PIN);
        delayMicroseconds(40);
    }
    return (sum / 4);
}

float SensorManager::getVoltage(int rawValue)
{
    return (static_cast<float>(rawValue) * 3.3f) / 1023.0f;
}

int SensorManager::getPercentage(int rawValue)
{
    if (rawValue <= 0) return 0;
    if (rawValue >= 1023) return 100;
    return map(rawValue, 0, 1023, 0, 100);
}

const char* SensorManager::getPressureDescription(int rawValue)
{
    if (rawValue < 25)  return "No Pressure (Empty)";
    if (rawValue < 250) return "Light Touch";
    if (rawValue < 650) return "Medium Pressure (Occupied)";
    return "Firm / Heavy Pressure";
}

int SensorManager::readSensor1()
{
    // FSR 1 on Multiplexer Channel C0
    return readChannel(MUX_CH_FSR1);
}

int SensorManager::readSensor2()
{
    // FSR 2 on Multiplexer Channel C1
    return readChannel(MUX_CH_FSR2);
}

int SensorManager::readSensor3()
{
    // FSR 3 on Multiplexer Channel C2
    return readChannel(MUX_CH_FSR3);
}

int SensorManager::readSensor4()
{
    // FSR 4 on Multiplexer Channel C3
    return readChannel(MUX_CH_FSR4);
}

void SensorManager::readAllSensors(int& s1, int& s2, int& s3, int& s4)
{
    s1 = readSensor1();
    s2 = readSensor2();
    s3 = readSensor3();
    s4 = readSensor4();
}
