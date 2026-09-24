import React from 'react';
import { Box, Typography, Paper, Tooltip, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const getPressureColor = (value) => {
  if (value < 10) return { bg: 'rgba(92, 92, 107, 0.15)', text: '#9A9AA5', border: 'rgba(92, 92, 107, 0.3)', label: 'Idle / Low' };
  if (value <= 40) return { bg: 'rgba(47, 191, 160, 0.2)', text: '#C6F26C', border: '#2FBFA0', label: 'Balanced' };
  if (value <= 70) return { bg: 'rgba(255, 176, 32, 0.2)', text: '#FFB020', border: '#FFB020', label: 'Moderate' };
  return { bg: 'rgba(255, 91, 110, 0.25)', text: '#FF5B6E', border: '#FF5B6E', label: 'Overloaded' };
};

export const ChairHeatmap = ({ p1 = 34, p2 = 36, p3 = 42, p4 = 40, posture = 'Correct', size = 'medium' }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const p1Style = getPressureColor(p1);
  const p2Style = getPressureColor(p2);
  const p3Style = getPressureColor(p3);
  const p4Style = getPressureColor(p4);

  const isCompact = size === 'small';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: isCompact ? 1 : 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: isCompact ? 220 : 280,
          height: isCompact ? 260 : 310,
          borderRadius: '32px 32px 24px 24px',
          background: isDark
            ? 'linear-gradient(145deg, #121218 0%, #17171F 100%)'
            : 'linear-gradient(145deg, #EAE8F4 0%, #FFFFFF 100%)',
          boxShadow: isDark
            ? '0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 12px 32px rgba(0,0,0,0.06)',
          border: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          p: isCompact ? 1.5 : 2,
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
        }}
      >
        {/* Chair Backrest Indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: isCompact ? 120 : 160,
            height: 10,
            borderRadius: '999px 999px 0 0',
            background: 'linear-gradient(90deg, #C6F26C 0%, #2FBFA0 100%)',
            boxShadow: '0 0 12px rgba(198, 242, 108, 0.5)',
          }}
        />
        <Typography
          variant="caption"
          align="center"
          sx={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.2,
            color: 'text.secondary',
            textTransform: 'uppercase',
            mt: 0.5,
          }}
        >
          ▲ CHAIR BACKREST (TOP)
        </Typography>

        {/* 2x2 FSR Quadrant Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 1.5,
            flexGrow: 1,
            my: 1.5,
          }}
        >
          {/* P1: Top-Left */}
          <Tooltip title={`P1 (Top-Left): ${p1}% Pressure (${p1Style.label})`} arrow>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px 10px 10px 10px',
                backgroundColor: p1Style.bg,
                border: `2px solid ${p1Style.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: `0 0 20px ${p1Style.border}33`,
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: p1Style.text, fontSize: 11 }}>
                P1 (FL)
              </Typography>
              <Typography variant={isCompact ? 'h6' : 'h5'} sx={{ fontWeight: 900, color: p1Style.text }}>
                {p1}%
              </Typography>
            </Paper>
          </Tooltip>

          {/* P2: Top-Right */}
          <Tooltip title={`P2 (Top-Right): ${p2}% Pressure (${p2Style.label})`} arrow>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '10px 20px 10px 10px',
                backgroundColor: p2Style.bg,
                border: `2px solid ${p2Style.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: `0 0 20px ${p2Style.border}33`,
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: p2Style.text, fontSize: 11 }}>
                P2 (FR)
              </Typography>
              <Typography variant={isCompact ? 'h6' : 'h5'} sx={{ fontWeight: 900, color: p2Style.text }}>
                {p2}%
              </Typography>
            </Paper>
          </Tooltip>

          {/* P3: Bottom-Left */}
          <Tooltip title={`P3 (Bottom-Left): ${p3}% Pressure (${p3Style.label})`} arrow>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '10px 10px 10px 20px',
                backgroundColor: p3Style.bg,
                border: `2px solid ${p3Style.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: `0 0 20px ${p3Style.border}33`,
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: p3Style.text, fontSize: 11 }}>
                P3 (BL)
              </Typography>
              <Typography variant={isCompact ? 'h6' : 'h5'} sx={{ fontWeight: 900, color: p3Style.text }}>
                {p3}%
              </Typography>
            </Paper>
          </Tooltip>

          {/* P4: Bottom-Right */}
          <Tooltip title={`P4 (Bottom-Right): ${p4}% Pressure (${p4Style.label})`} arrow>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '10px 10px 20px 10px',
                backgroundColor: p4Style.bg,
                border: `2px solid ${p4Style.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: `0 0 20px ${p4Style.border}33`,
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: p4Style.text, fontSize: 11 }}>
                P4 (BR)
              </Typography>
              <Typography variant={isCompact ? 'h6' : 'h5'} sx={{ fontWeight: 900, color: p4Style.text }}>
                {p4}%
              </Typography>
            </Paper>
          </Tooltip>
        </Box>

        {/* Heatmap Status Pill */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip
            size="small"
            label={`Posture: ${posture}`}
            sx={{
              fontWeight: 800,
              fontSize: 11,
              bgcolor: posture === 'Correct' ? 'rgba(47, 191, 160, 0.2)' : 'rgba(255, 176, 32, 0.2)',
              color: posture === 'Correct' ? '#C6F26C' : '#FFB020',
              border: `1px solid ${posture === 'Correct' ? '#2FBFA0' : '#FFB020'}`,
            }}
          />
        </Box>
      </Box>

      {/* Heatmap Color Scale */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2FBFA0' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>0-40%</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FFB020' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>41-70%</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF5B6E' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>&gt;70%</Typography>
        </Box>
      </Box>
    </Box>
  );
};
