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
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
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
import { useTheme } from '@mui/material/styles';

export const LiveMonitoring = ({
  sensorData,
  history,
  isStreaming,
  isOnline,
  latency,
  toggleStreaming,
  toggleOnlineStatus,
  forcePosture,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Title Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'serif' }}>
            Live Chair FSR Monitoring
          </Typography>
          <Typography variant="body2" color="text.secondary">
            High-Frequency Pressure Sensor Telemetry & ESP32 Microcontroller Status
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Chip
            icon={<WifiIcon />}
            label={isOnline ? `ESP32 ONLINE (${latency}ms)` : 'ESP32 DISCONNECTED'}
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

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Column: Expanded Interactive Chair Heatmap */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                High-Resolution Seat Pressure Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                4-Quadrant FSR Arrays with Real-time Weight Balance Vectoring
              </Typography>

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
                      P1 (FRONT LEFT)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1FBE8C' }}>
                      {sensorData.p1}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      P2 (FRONT RIGHT)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#3B82F6' }}>
                      {sensorData.p2}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      P3 (BACK LEFT)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                      {sensorData.p3}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      P4 (BACK RIGHT)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444' }}>
                      {sensorData.p4}%
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
                        Real-Time Raw FSR Sensor Signals (P1 - P4)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Continuous pressure values (0 - 100%) streamed over MQTT WebSocket
                      </Typography>
                    </Box>
                    <Chip label="20 Data Points Buffer" size="small" variant="outlined" />
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
                        <Line type="monotone" dataKey="p1" name="P1 (Front Left)" stroke="#1FBE8C" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="p2" name="P2 (Front Right)" stroke="#3B82F6" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="p3" name="P3 (Back Left)" stroke="#F59E0B" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="p4" name="P4 (Back Right)" stroke="#EF4444" strokeWidth={2.5} dot={false} isAnimationActive={false} />
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

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <MemoryIcon color="primary" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            MCU Core
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          ESP32 Dual-Core (240MHz)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Firmware: v2.4.1-build809
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <BatteryChargingFullIcon color="success" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Power & Battery
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          92% Charged (LiPo 3.7V)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Est. Runtime: 18.4 Hours
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <SensorsIcon color="secondary" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Sampling Rate
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          500 ms (2.0 Hz)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last Sync: {sensorData.lastSync}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                      control={<Switch checked={isOnline} onChange={toggleOnlineStatus} color="primary" />}
                      label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Simulate Hardware Disconnection</Typography>}
                    />
                    <Button variant="text" startIcon={<RefreshIcon />} size="small">
                      Force Zero Calibration
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
