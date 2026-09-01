import React from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Button,
  LinearProgress,
  Avatar,
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import SpeedIcon from '@mui/icons-material/Speed';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SensorsIcon from '@mui/icons-material/Sensors';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { KPICard } from '../components/KPICard';
import { ChairHeatmap } from '../components/ChairHeatmap';
import { useNavigate } from 'react-router-dom';
import heroChairImg from '../assets/hero-chair.png';

export const Dashboard = ({ sensorData, history, isStreaming, toggleStreaming, forcePosture }) => {
  const navigate = useNavigate();

  const getPosturePill = (posture) => {
    switch (posture) {
      case 'Correct':
        return <Chip label="✓ Correct" size="small" sx={{ bgcolor: 'rgba(47, 191, 160, 0.15)', color: '#2FBFA0', border: '1px solid #2FBFA040', fontWeight: 800, fontSize: 11 }} />;
      case 'Slouching':
        return <Chip label="⚠ Slouching" size="small" sx={{ bgcolor: 'rgba(255, 91, 110, 0.15)', color: '#FF5B6E', border: '1px solid #FF5B6E40', fontWeight: 800, fontSize: 11 }} />;
      case 'Forward Lean':
      case 'Backward Lean':
        return <Chip label={posture} size="small" sx={{ bgcolor: 'rgba(155, 123, 255, 0.15)', color: '#9B7BFF', border: '1px solid #9B7BFF40', fontWeight: 800, fontSize: 11 }} />;
      case 'Left Lean':
      case 'Right Lean':
        return <Chip label={posture} size="small" sx={{ bgcolor: 'rgba(255, 176, 32, 0.15)', color: '#FFB020', border: '1px solid #FFB02040', fontWeight: 800, fontSize: 11 }} />;
      default:
        return <Chip label={posture} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#9A9AA5', fontWeight: 800, fontSize: 11 }} />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Bold Ethereal Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.03em' }}>
            My Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
            Real-Time Sedentary Ergonomics & 4-Quadrant FSR Telemetry
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={toggleStreaming}
            sx={{
              borderRadius: '999px',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: 'text.primary',
              fontWeight: 700,
              px: 2.5,
              fontSize: 13,
            }}
          >
            {isStreaming ? 'Pause Telemetry' : 'Resume Telemetry'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/live')}
            sx={{ borderRadius: '999px', fontWeight: 800, px: 3, fontSize: 13 }}
          >
            Live Monitor
          </Button>
        </Box>
      </Box>

      {/* Top Grid: Hero Gradient Card + Standard Dark Cards */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Large Hero Gradient Card: SBI Score */}
        <Grid item xs={12} lg={6}>
          <KPICard
            variant="hero-lime"
            title="SEDENTARY BEHAVIOUR INDEX"
            value={`${sensorData.sbiScore} / 100`}
            subtext="Calculated from sitting duration, posture stability, and break frequency."
            delta="-12.4% vs yesterday"
            deltaType="positive"
            primaryActionLabel="View Analytics"
            secondaryActionLabel="Break Schedule"
            onPrimaryAction={() => navigate('/sedentary-analytics')}
            onSecondaryAction={() => navigate('/alerts')}
          />
        </Grid>

        {/* Top-Right: 2 Stacked Standard Dark Cards */}
        <Grid item xs={12} lg={6}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid item xs={12} sm={6}>
              <KPICard
                title="SITTING DURATION"
                value={`${sensorData.sittingDurationMinutes} min`}
                subtext="Continuous posture duration"
                delta="+15.7%"
                deltaType="negative"
                icon={TimerIcon}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <KPICard
                title="CURRENT POSTURE"
                value={sensorData.posture}
                subtext={`Confidence: ${sensorData.confidence}%`}
                delta={sensorData.posture === 'Correct' ? 'Optimal' : 'Needs Shift'}
                deltaType={sensorData.posture === 'Correct' ? 'positive' : 'negative'}
                icon={AccessibilityNewIcon}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <KPICard
                variant="hero-purple"
                title="SEDENTARY RISK LEVEL"
                value={sensorData.riskLevel}
                subtext="Action Recommended: Stand up and walk for 2 minutes to restore vascular flow."
                primaryActionLabel="Clinical Insights"
                onPrimaryAction={() => navigate('/posture-analytics')}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Middle Row: FSR Heatmap Panel & Physio Signals */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* FSR Pressure-Zone Heatmap Panel — with chair product photo */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Seat Cushion FSR Pressure Map
                </Typography>
                <Chip
                  label="4-Quadrant Array"
                  size="small"
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: 'text.secondary', fontWeight: 700 }}
                />
              </Box>

              {/* Chair photo + heatmap side by side */}
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flexGrow: 1 }}>
                {/* Chair product photo */}
                <Box
                  sx={{
                    position: 'relative',
                    flexShrink: 0,
                    width: 110,
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Ambient glow behind chair */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 130,
                      height: 130,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(198,242,108,0.18) 0%, rgba(47,191,160,0.08) 50%, transparent 72%)',
                      filter: 'blur(20px)',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%,-50%)',
                    }}
                  />
                  <Box
                    component="img"
                    src={heroChairImg}
                    alt="Smart Chair"
                    sx={{
                      width: 100,
                      height: 'auto',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.6))',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </Box>

                {/* Heatmap */}
                <Box sx={{ flexGrow: 1 }}>
                  <ChairHeatmap
                    p1={sensorData.p1}
                    p2={sensorData.p2}
                    p3={sensorData.p3}
                    p4={sensorData.p4}
                    posture={sensorData.posture}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Posture Detail & Demo Simulation Presets */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Real-Time Posture Classifier & Biometrics
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: sensorData.posture === 'Correct' ? 'rgba(47, 191, 160, 0.2)' : 'rgba(255, 176, 32, 0.2)',
                    color: sensorData.posture === 'Correct' ? '#C6F26C' : '#FFB020',
                  }}
                >
                  <AccessibilityNewIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    {sensorData.posture}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Machine Learning Classifier Confidence: <strong>{sensorData.confidence}%</strong>
                  </Typography>
                </Box>
                {getPosturePill(sensorData.posture)}
              </Box>

              {/* Heart Rate & Temp Sub-Cards */}
              <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <FavoriteIcon sx={{ color: '#FF5B6E', fontSize: 28 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                          HEART RATE (MAX30102)
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                          {sensorData.heartRate} <span style={{ fontSize: 13, color: '#9A9AA5' }}>bpm</span>
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ThermostatIcon sx={{ color: '#FFB020', fontSize: 28 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                          SKIN TEMPERATURE
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                          {sensorData.temperature} <span style={{ fontSize: 13, color: '#9A9AA5' }}>°C</span>
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Simulation Quick Triggers */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>
                  SIMULATE POSTURE EVENT (DEMO PRESETS):
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['Correct', 'Slouching', 'Forward Lean', 'Left Lean', 'Right Lean', 'Chair Empty'].map((p) => (
                    <Chip
                      key={p}
                      label={p}
                      onClick={() => forcePosture(p)}
                      sx={{
                        fontWeight: 800,
                        cursor: 'pointer',
                        bgcolor: sensorData.posture === p ? '#C6F26C' : 'rgba(255, 255, 255, 0.05)',
                        color: sensorData.posture === p ? '#0D0D12' : '#9A9AA5',
                        '&:hover': { bgcolor: sensorData.posture === p ? '#C6F26C' : 'rgba(255, 255, 255, 0.12)' },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section: Recent Sensor Telemetry Stream (Fintech Activity List) */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Recent Sensor Telemetry Stream
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Auto-updating every ~2s via WebSocket (Last sync: {sensorData.lastSync})
              </Typography>
            </Box>

            <Button
              variant="text"
              onClick={() => navigate('/live')}
              endIcon={<ArrowForwardIcon />}
              sx={{ color: 'primary.main', fontWeight: 800, fontSize: 13 }}
            >
              See All Stream Data
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, bgcolor: 'transparent' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>TIME</TableCell>
                  <TableCell align="center">P1 (FL %)</TableCell>
                  <TableCell align="center">P2 (FR %)</TableCell>
                  <TableCell align="center">P3 (BL %)</TableCell>
                  <TableCell align="center">P4 (BR %)</TableCell>
                  <TableCell align="center">HEART RATE</TableCell>
                  <TableCell align="center">TEMP</TableCell>
                  <TableCell align="right">CLASSIFIED POSTURE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.slice().reverse().slice(0, 7).map((row, idx) => (
                  <TableRow
                    key={`${row.time}-${idx}`}
                    sx={{
                      backgroundColor: idx === 0 ? 'rgba(198, 242, 108, 0.04)' : 'transparent',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
                      {row.time}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, color: row.p1 > 70 ? '#FF5B6E' : 'text.primary' }}>
                      {row.p1}%
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, color: row.p2 > 70 ? '#FF5B6E' : 'text.primary' }}>
                      {row.p2}%
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, color: row.p3 > 70 ? '#FF5B6E' : 'text.primary' }}>
                      {row.p3}%
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, color: row.p4 > 70 ? '#FF5B6E' : 'text.primary' }}>
                      {row.p4}%
                    </TableCell>
                    <TableCell align="center">{row.heartRate} bpm</TableCell>
                    <TableCell align="center">{row.temperature} °C</TableCell>
                    <TableCell align="right">{getPosturePill(row.posture)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};
