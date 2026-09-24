// Comprehensive mock dataset for Smart Chair IoT System

export const initialSensorData = {
  p1: 34, // Top-Left pressure %
  p2: 36, // Top-Right pressure %
  p3: 42, // Bottom-Left pressure %
  p4: 40, // Bottom-Right pressure %
  heartRate: 74, // bpm
  temperature: 36.6, // °C
  posture: 'Correct',
  confidence: 94.8,
  sittingDurationMinutes: 52,
  sbiScore: 74, // Sedentary Behaviour Index (0-100)
  riskLevel: 'Moderate', // Low, Moderate, High
  isConnected: true,
  lastSync: new Date().toLocaleTimeString(),
};

export const postureList = [
  { name: 'Correct', color: '#1FBE8C', description: 'Balanced weight distribution across all 4 quadrants' },
  { name: 'Forward Lean', color: '#3B82F6', description: 'High pressure on front sensors (P3, P4), low back contact' },
  { name: 'Backward Lean', color: '#8B5CF6', description: 'Heavy rear tilt, increased spinal lumbar pressure' },
  { name: 'Left Lean', color: '#F59E0B', description: 'Asymmetric load leaning toward P1 and P3' },
  { name: 'Right Lean', color: '#F59E0B', description: 'Asymmetric load leaning toward P2 and P4' },
  { name: 'Slouching', color: '#EF4444', description: 'Pelvis rotated forward, high lumbar sacral stress' },
  { name: 'Chair Empty', color: '#64748B', description: 'No user pressure detected on seat sensors' },
];

export const weeklySittingData = [
  { day: 'Mon', sittingHours: 6.8, targetHours: 6.0, breaks: 9, avgSbi: 68 },
  { day: 'Tue', sittingHours: 7.5, targetHours: 6.0, breaks: 6, avgSbi: 79 },
  { day: 'Wed', sittingHours: 5.4, targetHours: 6.0, breaks: 11, avgSbi: 58 },
  { day: 'Thu', sittingHours: 8.2, targetHours: 6.0, breaks: 5, avgSbi: 84 },
  { day: 'Fri', sittingHours: 6.2, targetHours: 6.0, breaks: 10, avgSbi: 65 },
  { day: 'Sat', sittingHours: 3.5, targetHours: 4.0, breaks: 14, avgSbi: 42 },
  { day: 'Sun', sittingHours: 2.8, targetHours: 4.0, breaks: 16, avgSbi: 35 },
];

export const sbiTrend7Days = [
  { day: 'Mon', sbi: 68, risk: 'Moderate' },
  { day: 'Tue', sbi: 79, risk: 'High' },
  { day: 'Wed', sbi: 58, risk: 'Moderate' },
  { day: 'Thu', sbi: 84, risk: 'High' },
  { day: 'Fri', sbi: 65, risk: 'Moderate' },
  { day: 'Sat', sbi: 42, risk: 'Low' },
  { day: 'Sun', sbi: 35, risk: 'Low' },
];

export const postureDistribution = [
  { name: 'Correct Sitting', value: 62, color: '#1FBE8C' },
  { name: 'Slouching', value: 18, color: '#EF4444' },
  { name: 'Left Lean', value: 8, color: '#F59E0B' },
  { name: 'Right Lean', value: 7, color: '#3B82F6' },
  { name: 'Forward Lean', value: 5, color: '#8B5CF6' },
];

export const postureTimeline = [
  { time: '09:00 AM', posture: 'Correct', duration: '45 mins', status: 'optimal' },
  { time: '09:45 AM', posture: 'Slouching', duration: '20 mins', status: 'warning' },
  { time: '10:05 AM', posture: 'Forward Lean', duration: '15 mins', status: 'info' },
  { time: '10:20 AM', posture: 'Chair Empty', duration: '10 mins (Break)', status: 'success' },
  { time: '10:30 AM', posture: 'Correct', duration: '50 mins', status: 'optimal' },
  { time: '11:20 AM', posture: 'Left Lean', duration: '30 mins', status: 'warning' },
  { time: '11:50 AM', posture: 'Slouching', duration: '40 mins', status: 'danger' },
  { time: '12:30 PM', posture: 'Chair Empty', duration: '60 mins (Lunch Break)', status: 'success' },
  { time: '01:30 PM', posture: 'Correct', duration: '55 mins', status: 'optimal' },
];

export const alertsFeed = [
  {
    id: 'ALT-101',
    title: 'Prolonged Sedentary Alert',
    description: 'You have been continuously sitting for over 52 minutes. Stand up and stretch!',
    severity: 'high', // high, medium, low
    timestamp: '10 mins ago',
    timeframe: 'today',
    icon: 'Timer',
    recommendation: 'Walk for 2 minutes to restore blood circulation in lower extremities.',
  },
  {
    id: 'ALT-102',
    title: 'Slouching Posture Detected',
    description: 'Uneven pressure on rear lumbar region. Pelvis rotated forward by 18 degrees.',
    severity: 'medium',
    timestamp: '25 mins ago',
    timeframe: 'today',
    icon: 'Accessibility',
    recommendation: 'Adjust seat depth and pull back straight against the ergonomic lumbar support.',
  },
  {
    id: 'ALT-103',
    title: 'High Pressure Asymmetry',
    description: 'P1 (Left Top) pressure is 45% higher than P2 (Right Top). Leaning heavily left.',
    severity: 'medium',
    timestamp: '1 hour ago',
    timeframe: 'today',
    icon: 'Scale',
    recommendation: 'Distribute weight evenly across both seat cushions.',
  },
  {
    id: 'ALT-104',
    title: 'Goal Achieved: Break Frequency',
    description: 'You took 8 recommended micro-breaks during morning work hours.',
    severity: 'low',
    timestamp: 'Yesterday',
    timeframe: 'week',
    icon: 'CheckCircle',
    recommendation: 'Great job maintaining vascular circulation throughout your shift!',
  },
  {
    id: 'ALT-105',
    title: 'Sensor Re-calibration Prompt',
    description: 'FSR Zone P3 baseline drift detected (+3.2% offset). Zero-point calibration advised.',
    severity: 'low',
    timestamp: '3 days ago',
    timeframe: 'month',
    icon: 'Settings',
    recommendation: 'Calibrate P3 in the Settings menu while chair is unoccupied.',
  },
];

export const userProfileData = {
  name: 'Dr. Alex Morgan',
  role: 'Research Fellow & Lead User',
  email: 'alex.morgan@healthiot.org',
  age: 28,
  weight: 70, // kg
  height: 175, // cm
  gender: 'Male',
  dailyGoalHours: 6.0,
  recommendedBreakIntervalMinutes: 45,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
};

export const settingsData = {
  mqtt: {
    brokerUrl: 'wss://broker.smartchair-iot.net:8084/mqtt',
    status: 'Connected',
    latencyMs: 24,
    topicPrefix: 'iot/smartchair/v1/telemetry/',
    qos: 1,
  },
  chair: {
    id: 'ESP32-SC-9042',
    model: 'SmartChair Pro v2.4',
    firmware: 'v2.4.1-build809',
    macAddress: '24:6F:28:B4:C9:10',
    batteryLevel: 92,
    isOnline: true,
    sensorCount: 6, // 4 FSR, 1 HR MAX30102, 1 Temp
  },
  calibration: {
    p1Offset: 0.0,
    p2Offset: 0.0,
    p3Offset: 3.2,
    p4Offset: 0.0,
    lastCalibrated: '2026-08-28 14:20',
  },
};

export const adminData = {
  stats: {
    totalChairs: 34,
    activeChairs: 28,
    inactiveChairs: 6,
    totalUsers: 42,
    activeAlerts: 5,
    systemUptime: '99.94%',
  },
  chairs: [
    { id: 'ESP32-SC-9042', location: 'Lab 3B - Desk 12', user: 'Dr. Alex Morgan', status: 'Online', battery: '92%', lastSeen: 'Just now' },
    { id: 'ESP32-SC-9043', location: 'Lab 3B - Desk 14', user: 'Prof. Sarah Jenkins', status: 'Online', battery: '85%', lastSeen: '2 mins ago' },
    { id: 'ESP32-SC-9044', location: 'Clinical Wing - Rm 102', user: 'Nurse David Kim', status: 'Online', battery: '98%', lastSeen: '1 min ago' },
    { id: 'ESP32-SC-9045', location: 'Research Lab 1A', user: 'Elena Rostova', status: 'Offline', battery: '12%', lastSeen: '2 days ago' },
    { id: 'ESP32-SC-9046', location: 'Ergonomics Test Bay', user: 'Unassigned', status: 'Idle', battery: '100%', lastSeen: '1 hour ago' },
  ],
  users: [
    { id: 'USR-001', name: 'Dr. Alex Morgan', email: 'alex.morgan@healthiot.org', role: 'User', chairId: 'ESP32-SC-9042', status: 'Active' },
    { id: 'USR-002', name: 'Prof. Sarah Jenkins', email: 's.jenkins@healthiot.org', role: 'Admin', chairId: 'ESP32-SC-9043', status: 'Active' },
    { id: 'USR-003', name: 'Nurse David Kim', email: 'd.kim@healthiot.org', role: 'User', chairId: 'ESP32-SC-9044', status: 'Active' },
    { id: 'USR-004', name: 'Elena Rostova', email: 'e.rostova@healthiot.org', role: 'Researcher', chairId: 'ESP32-SC-9045', status: 'Inactive' },
  ],
};
