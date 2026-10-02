#ifndef CHAIRSENSE_SENSOR_MANAGER_H
#define CHAIRSENSE_SENSOR_MANAGER_H

#include <Arduino.h>

class SensorManager
{
public:
    static void init();
    static void selectMuxChannel(uint8_t channel);
    
    // Voltage & Percentage helpers
    static float getVoltage(int rawValue);
    static int getPercentage(int rawValue);
    static const char* getPressureDescription(int rawValue);

    // Individual FSR read functions via CD74HC4067 (C0, C1, ...)
    static int readSensor1(); // C0
    static int readSensor2(); // C1
    static int readSensor3(); // C2
    static int readSensor4(); // C3

    // Direct / Channel Read
    static int readChannel(uint8_t channel);

    // Batch read all sensors
    static void readAllSensors(int& s1, int& s2, int& s3, int& s4);
};

#endif // CHAIRSENSE_SENSOR_MANAGER_H
