import { useState, useEffect, useRef, useCallback } from 'react';
import { initialSensorData } from '../services/mockData';

// Helper function to calculate posture from 4 FSR sensors
const classifyPosture = (p1, p2, p3, p4) => {
  const total = p1 + p2 + p3 + p4;
  if (total < 15) {
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

export const useSimulatedWebSocket = (intervalMs = 2000) => {
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [history, setHistory] = useState(() => {
    // Generate 15 initial historical data points for charts
    const now = new Date();
    return Array.from({ length: 15 }, (_, i) => {
      const time = new Date(now.getTime() - (15 - i) * 3000);
      const timeStr = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const p1 = Math.min(100, Math.max(10, 34 + Math.floor(Math.sin(i) * 8)));
      const p2 = Math.min(100, Math.max(10, 36 + Math.floor(Math.cos(i) * 7)));
      const p3 = Math.min(100, Math.max(10, 42 + Math.floor(Math.sin(i * 0.5) * 6)));
      const p4 = Math.min(100, Math.max(10, 40 + Math.floor(Math.cos(i * 0.5) * 6)));
      return {
        time: timeStr,
        p1,
        p2,
        p3,
        p4,
        heartRate: 72 + Math.floor(Math.sin(i) * 4),
        temperature: parseFloat((36.5 + Math.sin(i * 0.2) * 0.2).toFixed(1)),
        posture: 'Correct',
      };
    });
  });

  const [isStreaming, setIsStreaming] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [latency, setLatency] = useState(24);

  // Interval reference
  const intervalRef = useRef(null);

  const updateSensors = useCallback(() => {
    if (!isStreaming || !isOnline) return;

    setSensorData((prev) => {
      // Add slight noise
      const deltaP1 = (Math.random() - 0.48) * 6;
      const deltaP2 = (Math.random() - 0.48) * 6;
      const deltaP3 = (Math.random() - 0.48) * 5;
      const deltaP4 = (Math.random() - 0.48) * 5;

      const p1 = Math.min(95, Math.max(5, Math.round(prev.p1 + deltaP1)));
      const p2 = Math.min(95, Math.max(5, Math.round(prev.p2 + deltaP2)));
      const p3 = Math.min(95, Math.max(5, Math.round(prev.p3 + deltaP3)));
      const p4 = Math.min(95, Math.max(5, Math.round(prev.p4 + deltaP4)));

      const postureInfo = classifyPosture(p1, p2, p3, p4);

      const hrDelta = (Math.random() - 0.5) * 2;
      const heartRate = Math.min(100, Math.max(60, Math.round(prev.heartRate + hrDelta)));

      const tempDelta = (Math.random() - 0.5) * 0.05;
      const temperature = parseFloat(Math.min(37.5, Math.max(36.0, prev.temperature + tempDelta)).toFixed(1));

      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const newPoint = {
        time: timeStr,
        p1,
        p2,
        p3,
        p4,
        heartRate,
        temperature,
        posture: postureInfo.name,
      };

      setHistory((prevHist) => {
        const updated = [...prevHist, newPoint];
        return updated.length > 25 ? updated.slice(updated.length - 25) : updated;
      });

      setLatency(Math.round(20 + Math.random() * 12));

      return {
        ...prev,
        p1,
        p2,
        p3,
        p4,
        heartRate,
        temperature,
        posture: postureInfo.name,
        confidence: postureInfo.confidence,
        lastSync: timeStr,
      };
    });
  }, [isStreaming, isOnline]);

  useEffect(() => {
    if (isStreaming && isOnline) {
      intervalRef.current = setInterval(updateSensors, intervalMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStreaming, isOnline, intervalMs, updateSensors]);

  // Inject posture for testing demo
  const forcePosture = (postureName) => {
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

  const toggleStreaming = () => setIsStreaming((prev) => !prev);
  const toggleOnlineStatus = () => setIsOnline((prev) => !prev);

  return {
    sensorData,
    history,
    isStreaming,
    isOnline,
    latency,
    toggleStreaming,
    toggleOnlineStatus,
    forcePosture,
  };
};
