import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import WifiIcon from '@mui/icons-material/Wifi';
import MemoryIcon from '@mui/icons-material/Memory';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

import { ChairHeatmap } from '../components/ChairHeatmap';
import { LiveDeviceCard } from '../components/LiveDeviceCard';
import { useTheme } from '@mui/material/styles';
import { Snackbar, Alert } from '@mui/material';

export const LiveMonitoring = ({
  sensorData,
  history,
  isStreaming,
  isOnline,
  latency,
  toggleStreaming,
  toggleOnlineStatus,
  forcePosture,
  calibrateAll,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [calibToast, setCalibToast] = React.useState(false);

  const handleForceZero = () => {
    if (calibrateAll) {
      calibrateAll();
    }
    setCalibToast(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Title Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'serif' }}>
            Live Chair FSR Monitoring
          </Typography>
          <Typography variant="body2" color="text.secondary">
            High-Frequency Pressure Sensor Telemetry & ESP8266 Microcontroller Status
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Chip
            label={sensorData.isOccupied ? 'CHAIR OCCUPIED' : 'CHAIR EMPTY'}
            color={sensorData.isOccupied ? 'primary' : 'default'}
            sx={{ fontWeight: 800 }}
          />
          <Chip
            icon={<WifiIcon />}
            label={isOnline ? `ESP8266 ONLINE (${latency}ms)` : 'ESP8266 DISCONNECTED'}
            color={isOnline ? 'success' : 'error'}
            sx={{ fontWeight: 700 }}
          />
          <Button
            variant="contained"
            color={isStreaming ? 'warning' : 'primary'}
            startIcon={isStreaming ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={toggleStreaming}
          >
            {isStreaming ? 'Pause Stream' : 'Start Stream'}
          </Button>
        </Box>
      </Box>

      {/* Break Reminder Alert Banner */}
      {sensorData.breakReminderActive && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3, fontWeight: 700 }}>
          ⚠ Sedentary Break Reminder: Continuous sitting has exceeded 45 minutes ({sensorData.sittingDurationMinutes} min). Please stand up and stretch to restore healthy posture and circulation!
        </Alert>
      )}

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Column: Expanded Interactive Chair Heatmap */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                High-Resolution Seat Pressure Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                4-Quadrant FSR Arrays with Real-time Weight Balance Vectoring
              </Typography>

              {/* Relative Pressure Pattern Summary */}
              <Paper variant="outlined" sx={{ p: 1.5, mb: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                  Relative Pressure Balance Patterns
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Seat: <span style={{ color: '#38bdf8' }}>{sensorData.seatBalance || 'Balanced'}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Backrest: <span style={{ color: '#F59E0B' }}>{sensorData.backrestBalance || 'Balanced'}</span>
                  </Typography>
                </Box>
              </Paper>

              <ChairHeatmap
                p1={sensorData.p1}
                p2={sensorData.p2}
                p3={sensorData.p3}
                p4={sensorData.p4}
                posture={sensorData.posture}
                size="large"
              />

              <Divider sx={{ my: 3 }} />

              {/* FSR Values Breakdown Cards */}
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      FSR 1 / C0 (SEAT LEFT)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1FBE8C' }}>
                      {sensorData.p1}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {sensorData.raw1 || 0} RAW ADC ({sensorData.v1 || '0.00'}V)
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      FSR 2 / C1 (SEAT RIGHT)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#3B82F6' }}>
                      {sensorData.p2}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {sensorData.raw2 || 0} RAW ADC ({sensorData.v2 || '0.00'}V)
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      FSR 3 / C2 (BACK LEFT)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                      {sensorData.p3}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {sensorData.raw3 || 0} RAW ADC ({sensorData.v3 || '0.00'}V)
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      FSR 4 / C3 (BACK RIGHT)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444' }}>
                      {sensorData.p4}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {sensorData.raw4 || 0} RAW ADC ({sensorData.v4 || '0.00'}V)
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Manual Trigger Controls */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Test Posture Presets:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['Correct', 'Slouching', 'Forward Lean', 'Left Lean', 'Right Lean', 'Chair Empty'].map((p) => (
                    <Chip
                      key={p}
                      label={p}
                      onClick={() => forcePosture(p)}
                      variant={sensorData.posture === p ? 'filled' : 'outlined'}
                      color={sensorData.posture === p ? 'primary' : 'default'}
                      sx={{ fontWeight: 700, cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Real-Time Recharts Line Chart + Device Status */}
        <Grid item xs={12} lg={7}>
          <Grid container spacing={3}>
            {/* Real-time FSR Sensor Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Real-Time Raw FSR Sensor Signals (Channels C0 - C3)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Continuous pressure values (0 - 100%) streamed via MQTT & WebSocket
                      </Typography>
                    </Box>
                    <Chip label="Live 4-Ch MUX Buffer" size="small" variant="outlined" />
                  </Box>

                  <Box sx={{ width: '100%', height: 340 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
                        <XAxis dataKey="time" stroke={theme.palette.text.secondary} tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} stroke={theme.palette.text.secondary} tick={{ fontSize: 11 }} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#0F2445' : '#FFFFFF',
                            borderColor: theme.palette.divider,
                            borderRadius: 12,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 10 }} />
                        <Line type="monotone" dataKey="p1" name="FSR 1 (C0 Front Left)" stroke="#1FBE8C" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="p2" name="FSR 2 (C1 Front Right)" stroke="#3B82F6" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="p3" name="FSR 3 (C2 Back Left)" stroke="#F59E0B" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="p4" name="FSR 4 (C3 Back Right)" stroke="#EF4444" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Device Connection Status Card */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    IoT Hardware & Gateway Diagnostics
                  </Typography>

                  <Box sx={{ my: 1.5 }}>
                    <LiveDeviceCard
                      deviceId={sensorData.deviceId || 'CHAIR001'}
                      status={isOnline ? 'ONLINE' : 'OFFLINE'}
                      wifiRssi={sensorData.wifi || -45}
                      ipAddress={sensorData.ipAddress || '192.168.4.1'}
                      firmwareVersion="1.0.0"
                      lastSeen={sensorData.lastSync || 'Just now'}
                      brokerHost="broker.emqx.io"
                    />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                      control={<Switch checked={isOnline} onChange={toggleOnlineStatus} color="primary" />}
                      label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Simulate Hardware Disconnection</Typography>}
                    />
                    <Button variant="outlined" color="primary" startIcon={<RefreshIcon />} size="small" onClick={handleForceZero} sx={{ fontWeight: 700 }}>
                      Force Zero Calibration
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Calibration Toast */}
      <Snackbar open={calibToast} autoHideDuration={3500} onClose={() => setCalibToast(false)}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2, fontWeight: 700 }}>
          ✓ Tare Zero Calibration Complete: All 4 FSR Sensors Zeroed to 0.0% &amp; Baseline Saved!
        </Alert>
      </Snackbar>
    </Box>
  );
};
