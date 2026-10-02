import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Tooltip, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import RouterIcon from '@mui/icons-material/Router';
import MemoryIcon from '@mui/icons-material/Memory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

/**
 * LiveDeviceCard - Displays real-time hardware status, WiFi RSSI, and MQTT connectivity
 * Supporting states: ONLINE, OFFLINE, DISCONNECTED
 */
export const LiveDeviceCard = ({
  deviceId = 'CHAIR001',
  status = 'ONLINE', // 'ONLINE', 'OFFLINE', 'DISCONNECTED'
  wifiRssi = -45,
  ipAddress = '192.168.1.100',
  macAddress = 'CC:50:E3:XX:XX:XX',
  firmwareVersion = '1.0.0',
  lastSeen = 'Just now',
  brokerHost = 'broker.emqx.io',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Normalize Status
  const normalizedStatus = (status || 'DISCONNECTED').toUpperCase();
  const isOnline = normalizedStatus === 'ONLINE';
  const isOffline = normalizedStatus === 'OFFLINE';
  const isDisconnected = normalizedStatus === 'DISCONNECTED';

  // State-specific styling
  let statusColor = '#2FBFA0'; // Emerald Green
  let statusBg = 'rgba(47, 191, 160, 0.12)';
  let statusBorder = 'rgba(47, 191, 160, 0.35)';
  let statusLabel = 'ONLINE';

  if (isOffline) {
    statusColor = '#FFA000'; // Amber Warning
    statusBg = 'rgba(255, 160, 0, 0.12)';
    statusBorder = 'rgba(255, 160, 0, 0.35)';
    statusLabel = 'OFFLINE';
  } else if (isDisconnected) {
    statusColor = '#FF5B6E'; // Coral Red
    statusBg = 'rgba(255, 91, 110, 0.12)';
    statusBorder = 'rgba(255, 91, 110, 0.35)';
    statusLabel = 'DISCONNECTED';
  }

  // Calculate WiFi Signal Quality Percentage (RSSI between -100 and -30 dBm)
  const getSignalQuality = (rssi) => {
    if (!rssi || rssi <= -100) return 0;
    if (rssi >= -50) return 100;
    return Math.round(2 * (rssi + 100));
  };
  const signalQuality = getSignalQuality(wifiRssi);

  return (
    <Card
      sx={{
        borderRadius: '20px',
        background: isDark
          ? 'linear-gradient(145deg, #1A1A24 0%, #13131A 100%)'
          : 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FD 100%)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        boxShadow: isDark
          ? '0 10px 30px rgba(0, 0, 0, 0.45)'
          : '0 8px 24px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: isDark
            ? '0 14px 36px rgba(0, 0, 0, 0.6)'
            : '0 12px 30px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header: Device ID & Live State Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
              }}
            >
              <MemoryIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 0.5 }}>
                HARDWARE NODE
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                {deviceId}
              </Typography>
            </Box>
          </Box>

          {/* Status Badge */}
          <Chip
            icon={
              isOnline ? (
                <CheckCircleIcon sx={{ fontSize: '14px !important', color: `${statusColor} !important` }} />
              ) : (
                <ErrorOutlineIcon sx={{ fontSize: '14px !important', color: `${statusColor} !important` }} />
              )
            }
            label={statusLabel}
            size="small"
            sx={{
              bgcolor: statusBg,
              color: statusColor,
              border: `1px solid ${statusBorder}`,
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: 0.6,
              px: 0.5,
              height: 24,
            }}
          />
        </Box>

        {/* WiFi Signal & RSSI Metric */}
        <Box
          sx={{
            p: 1.8,
            borderRadius: '14px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}`,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isOnline ? (
                <WifiIcon sx={{ fontSize: 18, color: '#2FBFA0' }} />
              ) : (
                <WifiOffIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              )}
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                WiFi Link (2.4 GHz)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: isOnline ? '#2FBFA0' : 'text.disabled' }}>
              {isOnline ? `${wifiRssi} dBm (${signalQuality}%)` : 'Disconnected'}
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={isOnline ? signalQuality : 0}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              '& .MuiLinearProgress-bar': {
                bgcolor: signalQuality > 70 ? '#2FBFA0' : signalQuality > 40 ? '#FFA000' : '#FF5B6E',
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Network & Firmware Details */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: 10 }}>
              IP ADDRESS
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
              {isOnline ? ipAddress : '—'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: 10 }}>
              FIRMWARE
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              v{firmwareVersion} (ESP-12E)
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: 10 }}>
              MQTT BROKER
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, fontSize: 11 }} noWrap>
              {brokerHost}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: 10 }}>
              LAST SEEN
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: isOnline ? 'text.primary' : 'text.secondary' }}>
              {lastSeen}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
