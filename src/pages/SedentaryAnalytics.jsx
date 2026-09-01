import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Paper,
  LinearProgress,
  Button,
} from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

import { RiskGauge } from '../components/RiskGauge';
import { weeklySittingData, sbiTrend7Days } from '../services/mockData';
import { useTheme } from '@mui/material/styles';

export const SedentaryAnalytics = ({ currentSbi = 74 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [period, setPeriod] = useState('Weekly'); // 'Weekly' | 'Monthly'

  const breaksToday = 8;
  const breaksRecommended = 10;
  const breakPercentage = Math.min(100, Math.round((breaksToday / breaksRecommended) * 100));

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Bold Ethereal Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.03em' }}>
              Sedentary Analytics
            </Typography>
            <Chip
              label="CORE RESEARCH"
              sx={{ bgcolor: 'rgba(198, 242, 108, 0.2)', color: '#C6F26C', fontWeight: 900, fontSize: 11 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
            Sitting Duration Revenue Flow, Micro-Breaks & SBI Clinical Risk Model
          </Typography>
        </Box>
      </Box>

      {/* Row 1: Semicircular Risk Gauge & Micro-Break Panel */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Risk Gauge Card */}
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  SBI Risk Gauge
                </Typography>
                <Chip label="Clinical" size="small" sx={{ bgcolor: 'rgba(255, 176, 32, 0.15)', color: '#FFB020', fontWeight: 800 }} />
              </Box>

              <RiskGauge value={currentSbi} />

              <Box sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', textAlign: 'left' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>
                  RISK EVALUATION:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5, color: currentSbi >= 67 ? '#FF5B6E' : '#FFB020' }}>
                  {currentSbi >= 67 ? '🔴 High Lumbar & Capillary Stress' : '🟡 Moderate Ergonomic Load'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Break Compliance Panel */}
        <Grid item xs={12} md={7} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Micro-Break Compliance & Vascular Relief
                </Typography>
                <Chip
                  icon={<DirectionsWalkIcon sx={{ color: '#2FBFA0 !important' }} />}
                  label={`${breaksToday} / ${breaksRecommended} Breaks`}
                  sx={{ bgcolor: 'rgba(47, 191, 160, 0.15)', color: '#2FBFA0', fontWeight: 900 }}
                />
              </Box>

              <Grid container spacing={2.5} sx={{ my: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      BREATHERS TAKEN TODAY
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#C6F26C', my: 0.5 }}>
                      {breaksToday} <span style={{ fontSize: 16, color: '#9A9AA5' }}>breaks</span>
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>Goal Progress</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>{breakPercentage}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={breakPercentage}
                        sx={{
                          height: 8,
                          borderRadius: 999,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 999,
                            background: 'linear-gradient(90deg, #C6F26C 0%, #2FBFA0 100%)',
                          },
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      AVG BREAK DURATION
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#9B7BFF', my: 0.5 }}>
                      4.2 <span style={{ fontSize: 16, color: '#9A9AA5' }}>mins</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Optimal for leg micro-circulation recovery.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Muted Purple Bar Chart (Sitting Duration by Day) + 7-Day SBI Trend */}
      <Grid container spacing={3}>
        {/* Bar Chart Card with Period Toggle */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Sitting Duration Flow
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total daily sedentary hours logged by ESP32 FSR sensors
                  </Typography>
                </Box>

                {/* Period Pill Toggle */}
                <Box sx={{ bgcolor: 'rgba(9, 9, 13, 0.8)', p: 0.4, borderRadius: '999px', display: 'flex', gap: 0.5 }}>
                  {['Weekly', 'Monthly'].map((p) => (
                    <Button
                      key={p}
                      size="small"
                      onClick={() => setPeriod(p)}
                      sx={{
                        borderRadius: '999px',
                        px: 2,
                        py: 0.4,
                        fontSize: 12,
                        fontWeight: 800,
                        bgcolor: period === p ? '#F5F5F7' : 'transparent',
                        color: period === p ? '#0D0D12' : '#9A9AA5',
                        '&:hover': { bgcolor: period === p ? '#FFFFFF' : 'rgba(255,255,255,0.08)' },
                      }}
                    >
                      {p}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySittingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                    <XAxis dataKey="day" stroke="#9A9AA5" />
                    <YAxis stroke="#9A9AA5" unit="h" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#17171F',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 14,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                      }}
                    />
                    <Bar dataKey="sittingHours" name="Sitting Hours" fill="#9B7BFF" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="targetHours" name="Target Max (6h)" fill="rgba(255, 255, 255, 0.1)" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 7-Day SBI Trend Line Chart */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  7-Day SBI Trajectory
                </Typography>
                <Chip label="7-Day History" size="small" sx={{ bgcolor: 'rgba(155, 123, 255, 0.15)', color: '#9B7BFF', fontWeight: 800 }} />
              </Box>

              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sbiTrend7Days} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sbiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C6F26C" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2FBFA0" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                    <XAxis dataKey="day" stroke="#9A9AA5" />
                    <YAxis domain={[0, 100]} stroke="#9A9AA5" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#17171F',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 14,
                      }}
                    />
                    <Area type="monotone" dataKey="sbi" name="SBI Score" stroke="#C6F26C" strokeWidth={3} fillOpacity={1} fill="url(#sbiGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
