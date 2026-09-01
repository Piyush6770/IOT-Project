import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SensorsIcon from '@mui/icons-material/Sensors';
import CpuIcon from '@mui/icons-material/Memory';
import CloudIcon from '@mui/icons-material/CloudQueue';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CodeIcon from '@mui/icons-material/Code';
import { ChairLogo } from './ChairLogo';

export const AboutModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth paperProps={{ style: { borderRadius: 20 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ChairLogo size={32} color="#F5F5F7" />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            About Smart Chair IoT System
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
          Real-Time Sedentary Behaviour Analysis & Ergonomic Health Monitoring
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', paragraph: true, leading: 1.6 }}>
          This system is an advanced IoT-enabled ergonomic healthcare platform designed to continuously analyze seating posture, detect sedentary risks, and promote vascular and spinal health. Embedded multi-point Force Sensitive Resistors (FSR), optical photoplethysmography (MAX30102), and precision thermal sensors stream live physiological metrics to a cloud telemetry pipeline.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 2 }}>
          System Architecture & Hardware Specs
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(31, 190, 140, 0.3)' }}>
              <CardContent>
                <SensorsIcon sx={{ color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  FSR Pressure Sensors
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  4-Zone Quadrant Array (P1-P4) measuring weight distribution & pelvic tilt angles.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              <CardContent>
                <CpuIcon sx={{ color: 'secondary.main', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  ESP32 Microcontroller
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  Dual-core Wi-Fi/Bluetooth MCU with onboard ADC and MQTT telemetry client.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <CardContent>
                <HealthAndSafetyIcon sx={{ color: 'warning.main', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  MAX30102 & Temp
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  Pulse oximetry heart rate sensor & precision skin temperature monitoring.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
              <CardContent>
                <CloudIcon sx={{ color: '#8B5CF6', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Cloud & Analytics
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  Java Spring Boot REST API, Supabase PostgreSQL, and live WebSocket engine.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, borderRadius: 3, bgcolor: 'background.default', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            Sedentary Behaviour Index (SBI) Formula
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', display: 'block' }}>
            SBI = w1 · (SittingDuration / Target) + w2 · (100 - PostureScore) + w3 · (1 - BreakFrequency) + w4 · PhysioStress
          </Typography>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip icon={<CodeIcon />} label="React 18 + Vite" size="small" variant="outlined" />
          <Chip label="Material UI (MUI v5)" size="small" variant="outlined" />
          <Chip label="Recharts Engine" size="small" variant="outlined" />
          <Chip label="Simulated WebSocket Pipeline" size="small" variant="outlined" />
          <Chip label="MQTT v3.1.1 Broker Compatible" size="small" color="primary" />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained">
          Close Project Overview
        </Button>
      </DialogActions>
    </Dialog>
  );
};
