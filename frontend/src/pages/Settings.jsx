import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  TextField,
  Divider,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import MemoryIcon from '@mui/icons-material/Memory';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

import { settingsData } from '../services/mockData';

export const Settings = ({ isOnline = true, latency = 24 }) => {
  const [mqttConfig, setMqttConfig] = useState(settingsData.mqtt);
  const [chairConfig, setChairConfig] = useState(settingsData.chair);
  const [calib, setCalib] = useState(settingsData.calibration);

  const [calibratingSensor, setCalibratingSensor] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const handleCalibrateSensor = (sensorKey, sensorName) => {
    setCalibratingSensor(sensorKey);
    setTimeout(() => {
      setCalibratingSensor(null);
      setCalib((prev) => ({
        ...prev,
        [`${sensorKey}Offset`]: 0.0,
        lastCalibrated: new Date().toLocaleTimeString(),
      }));
      setToastMsg(`${sensorName} Tare Zero Calibration completed successfully! Baseline set to 0.0%`);
    }, 1500);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'serif' }}>
            System Settings & Hardware Calibration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            MQTT Telemetry Broker Configuration, ESP32 Gateway & Individual FSR Tare Calibration
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Panel 1: MQTT Status & Connection Configuration */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CloudQueueIcon color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    MQTT Telemetry Broker Panel
                  </Typography>
                </Box>
                <Chip
                  label={isOnline ? `CONNECTED (${latency}ms)` : 'OFFLINE'}
                  color={isOnline ? 'success' : 'error'}
                  sx={{ fontWeight: 800 }}
                />
              </Box>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2.5, bgcolor: 'background.default' }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      BROKER ENDPOINT
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      {mqttConfig.brokerUrl}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      PROTOCOL & QOS
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      MQTT v3.1.1 (QoS {mqttConfig.qos})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      TELEMETRY TOPIC PREFIX
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                      {mqttConfig.topicPrefix}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Broker Settings:
              </Typography>
              <TextField
                fullWidth
                label="MQTT Server URL"
                value={mqttConfig.brokerUrl}
                onChange={(e) => setMqttConfig({ ...mqttConfig, brokerUrl: e.target.value })}
                margin="dense"
                size="small"
              />
              <TextField
                fullWidth
                label="Topic Prefix"
                value={mqttConfig.topicPrefix}
                onChange={(e) => setMqttConfig({ ...mqttConfig, topicPrefix: e.target.value })}
                margin="dense"
                size="small"
              />

              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button variant="contained" size="small" onClick={() => setToastMsg('MQTT Broker configuration updated!')}>
                  Save MQTT Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel 2: Smart Chair Hardware Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MemoryIcon color="secondary" sx={{ fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Chair Hardware & Gateway Panel
                  </Typography>
                </Box>
                <Chip label={chairConfig.id} color="secondary" sx={{ fontWeight: 800 }} />
              </Box>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2.5, bgcolor: 'background.default' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      MODEL & FIRMWARE
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {chairConfig.model} ({chairConfig.firmware})
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      MAC ADDRESS
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      {chairConfig.macAddress}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      BATTERY LEVEL
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {chairConfig.batteryLevel}% (LiPo 3.7V)
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      SENSORS ONLINE
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {chairConfig.sensorCount} / 6 Array Sensors
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <FormControlLabel
                control={<Switch defaultChecked color="primary" />}
                label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Enable ESP32 Over-the-Air (OTA) Firmware Auto-Updates</Typography>}
              />
              <FormControlLabel
                control={<Switch defaultChecked color="primary" />}
                label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Send High-Frequency Raw FSR Waveform Logs</Typography>}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Panel 3: Individual FSR Sensor Calibration Panel */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <BuildIcon color="warning" sx={{ fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      FSR Sensor Array Tare & Gain Calibration Panel
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calibrate individual zero-point baselines for each seat quadrant while chair is unoccupied
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Last Calibrated: {calib.lastCalibrated}
                </Typography>
              </Box>

              <Grid container spacing={2.5} sx={{ mt: 1 }}>
                {[
                  { key: 'p1', name: 'P1: Top-Left (Front Left)', offset: calib.p1Offset },
                  { key: 'p2', name: 'P2: Top-Right (Front Right)', offset: calib.p2Offset },
                  { key: 'p3', name: 'P3: Bottom-Left (Back Left)', offset: calib.p3Offset },
                  { key: 'p4', name: 'P4: Bottom-Right (Back Right)', offset: calib.p4Offset },
                ].map((s) => (
                  <Grid item xs={12} sm={6} md={3} key={s.key}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {s.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        Offset Drift: {s.offset > 0 ? `+${s.offset}%` : `${s.offset}%`}
                      </Typography>

                      {calibratingSensor === s.key ? (
                        <Box sx={{ py: 1 }}>
                          <LinearProgress color="warning" />
                          <Typography variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 700 }}>
                            Zeroing Sensor...
                          </Typography>
                        </Box>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="warning"
                          size="small"
                          startIcon={<RefreshIcon />}
                          onClick={() => handleCalibrateSensor(s.key, s.name)}
                          sx={{ fontWeight: 700 }}
                        >
                          Calibrate {s.key.toUpperCase()}
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar Toast */}
      <Snackbar open={Boolean(toastMsg)} autoHideDuration={4000} onClose={() => setToastMsg('')}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2, fontWeight: 700 }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};
