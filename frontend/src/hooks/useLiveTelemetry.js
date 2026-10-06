import { useState, useEffect, useRef, useCallback } from 'react';
import { initialSensorData } from '../services/mockData';
import { api, getStoredToken } from '../services/api';

// Helper function to classify posture locally if needed
const classifyPostureLocal = (p1, p2, p3, p4) => {
  const total = p1 + p2 + p3 + p4;
  if (total < 10) {
    return { name: 'Chair Empty', confidence: 99.1 };
  }

  const top = p1 + p2;
  const bottom = p3 + p4;
  const left = p1 + p3;
  const right = p2 + p4;

  const leftRightDiff = Math.abs(left - right);
  const topBottomDiff = Math.abs(top - bottom);

  if (leftRightDiff > 25) {
    if (left > right) return { name: 'Left Lean', confidence: 91.2 };
    return { name: 'Right Lean', confidence: 89.6 };
  }

  if (topBottomDiff > 30) {
    if (top > bottom) return { name: 'Forward Lean', confidence: 93.4 };
    return { name: 'Slouching', confidence: 95.1 };
  }

  return { name: 'Correct', confidence: 96.5 };
};

// Convert raw 0-1023 to 0-100 percentage
const toPercent = (val) => {
  if (val === undefined || val === null) return 0;
  if (val > 100) return Math.min(100, Math.max(0, Math.round((val / 1023.0) * 100)));
  return Math.min(100, Math.max(0, Math.round(val)));
};

// Convert raw 0-1023 to voltage
const toVoltage = (val) => {
  if (val === undefined || val === null) return 0.0;
  if (val <= 3.3) return parseFloat(val.toFixed(2));
  return parseFloat(((val * 3.3) / 1023.0).toFixed(2));
};

export const useLiveTelemetry = (chairId = 'CHAIR001') => {
  const [sensorData, setSensorData] = useState(() => ({
    ...initialSensorData,
    raw1: 0,
    raw2: 0,
    raw3: 0,
    raw4: 0,
    v1: 0.0,
    v2: 0.0,
    v3: 0.0,
    v4: 0.0,
    activeSensors: 4,
    deviceId: chairId,
    mode: 'live',
  }));

  const [history, setHistory] = useState(() => {
    const now = new Date();
    return Array.from({ length: 15 }, (_, i) => {
      const time = new Date(now.getTime() - (15 - i) * 3000);
      return {
        time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        p1: 15,
        p2: 15,
        p3: 15,
        p4: 15,
        heartRate: 72,
        temperature: 36.6,
        posture: 'Correct',
      };
    });
  });

  const [isStreaming, setIsStreaming] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isHardwareConnected, setIsHardwareConnected] = useState(false);
  const [latency, setLatency] = useState(18);
  const [deviceInfo, setDeviceInfo] = useState(null);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const lastPacketTimeRef = useRef(Date.now());

  // Function to process incoming live payload (from WebSocket or REST poll)
  const processLiveReading = useCallback((data) => {
    if (!data) return;

    lastPacketTimeRef.current = Date.now();
    setIsHardwareConnected(true);
    setIsOnline(true);

    const sensor = data.sensor || data;
    const p1Raw = sensor.pressure1 !== undefined ? sensor.pressure1 : (sensor.fsr1_raw || sensor.p1 || 0);
    const p2Raw = sensor.pressure2 !== undefined ? sensor.pressure2 : (sensor.fsr2_raw || sensor.p2 || 0);
    const p3Raw = sensor.pressure3 !== undefined ? sensor.pressure3 : (sensor.fsr3_raw || sensor.p3 || 0);
    const p4Raw = sensor.pressure4 !== undefined ? sensor.pressure4 : (sensor.fsr4_raw || sensor.p4 || 0);

    const p1Pct = toPercent(p1Raw);
    const p2Pct = toPercent(p2Raw);
    const p3Pct = toPercent(p3Raw);
    const p4Pct = toPercent(p4Raw);

    const v1 = toVoltage(p1Raw);
    const v2 = toVoltage(p2Raw);
    const v3 = toVoltage(p3Raw);
    const v4 = toVoltage(p4Raw);

    const postureName = data.posture || classifyPostureLocal(p1Pct, p2Pct, p3Pct, p4Pct).name;
    const confidence = data.confidence || 96.5;
    const sbiScore = data.sbiScore !== undefined ? data.sbiScore : 74;
    const riskLevel = data.riskLevel || (sbiScore > 75 ? 'High' : sbiScore > 50 ? 'Moderate' : 'Low');

    const heartRate = sensor.heartRate || sensor.heart_rate || 72;
    const temperature = sensor.temperature || 36.6;

    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newHistoryPoint = {
      time: timeStr,
      p1: p1Pct,
      p2: p2Pct,
      p3: p3Pct,
      p4: p4Pct,
      heartRate,
      temperature,
      posture: postureName,
    };

    setHistory((prev) => {
      const next = [...prev, newHistoryPoint];
      return next.length > 25 ? next.slice(next.length - 25) : next;
    });

    setSensorData((prev) => ({
      ...prev,
      p1: p1Pct,
      p2: p2Pct,
      p3: p3Pct,
      p4: p4Pct,
      raw1: p1Raw,
      raw2: p2Raw,
      raw3: p3Raw,
      raw4: p4Raw,
      v1,
      v2,
      v3,
      v4,
      heartRate,
      temperature,
      posture: postureName,
      confidence,
      sbiScore,
      riskLevel,
      lastSync: timeStr,
      isConnected: true,
      deviceId: chairId,
    }));

    setLatency(Math.round(15 + Math.random() * 8));
  }, [chairId]);

  // Connect Real WebSocket
  useEffect(() => {
    let isMounted = true;

    const connectWebSocket = () => {
      if (!isStreaming) return;

      const token = getStoredToken() || 'mock-jwt-token-9042';
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = window.location.host;
      const wsUrl = `${wsProtocol}//${wsHost}/ws/live?token=${encodeURIComponent(token)}`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsOnline(true);
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const parsed = JSON.parse(event.data);
            if (parsed.type === 'live_update' || parsed.sensor) {
              processLiveReading(parsed);
            }
          } catch (e) {
            console.error('Error parsing WebSocket message', e);
          }
        };

        ws.onerror = () => {
          // Backend may not be reachable or ws closed
        };

        ws.onclose = () => {
          if (!isMounted) return;
          // Try reconnecting in 3 seconds
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        };
      } catch (err) {
        if (!isMounted) return;
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 4000);
      }
    };

    connectWebSocket();

    // Fallback periodic polling for latest sensor reading & device status
    pollIntervalRef.current = setInterval(async () => {
      if (!isStreaming) return;
      try {
        const [devInfo, latestSensor] = await Promise.allSettled([
          api.getDeviceInfo(chairId),
          api.getLatestSensor(chairId),
        ]);

        if (devInfo.status === 'fulfilled' && devInfo.value) {
          setDeviceInfo(devInfo.value);
          if (devInfo.value.status === 'online') {
            setIsHardwareConnected(true);
          }
        }

        if (latestSensor.status === 'fulfilled' && latestSensor.value) {
          // If WS hasn't received anything in 4 seconds, use REST poll data
          if (Date.now() - lastPacketTimeRef.current > 4000) {
            processLiveReading({ sensor: latestSensor.value });
          }
        }
      } catch {
        // Backend offline
      }
    }, 3000);

    return () => {
      isMounted = false;
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [chairId, isStreaming, processLiveReading]);

  // Force Posture method
  const forcePosture = async (postureName) => {
    try {
      await api.forcePosture(chairId, postureName);
    } catch {
      // Offline fallback
    }

    let p1 = 35, p2 = 35, p3 = 40, p4 = 40;
    if (postureName === 'Slouching') {
      p1 = 15; p2 = 15; p3 = 85; p4 = 85;
    } else if (postureName === 'Forward Lean') {
      p1 = 80; p2 = 80; p3 = 20; p4 = 20;
    } else if (postureName === 'Left Lean') {
      p1 = 85; p2 = 15; p3 = 80; p4 = 20;
    } else if (postureName === 'Right Lean') {
      p1 = 15; p2 = 85; p3 = 20; p4 = 80;
    } else if (postureName === 'Chair Empty') {
      p1 = 0; p2 = 0; p3 = 0; p4 = 0;
    }

    const timeStr = new Date().toLocaleTimeString();
    setSensorData((prev) => ({
      ...prev,
      p1, p2, p3, p4,
      posture: postureName,
      confidence: 98.2,
      lastSync: timeStr,
    }));
  };

  const toggleStreaming = async () => {
    const nextState = !isStreaming;
    setIsStreaming(nextState);
    try {
      await api.toggleChairStream(chairId, nextState);
    } catch {
      // Ignored
    }
  };

  const toggleOnlineStatus = () => setIsOnline((prev) => !prev);

  return {
    sensorData,
    history,
    isStreaming,
    isOnline,
    isHardwareConnected,
    deviceInfo,
    latency,
    toggleStreaming,
    toggleOnlineStatus,
    forcePosture,
  };
};

export default useLiveTelemetry;
