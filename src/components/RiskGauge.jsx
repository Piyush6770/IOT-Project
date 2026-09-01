import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const RiskGauge = ({ value = 74, title = 'Sedentary Risk Level' }) => {
  const theme = useTheme();

  const score = Math.min(100, Math.max(0, value));

  let riskCategory = 'Low Risk';
  let riskColor = '#2FBFA0';
  let riskBg = 'rgba(47, 191, 160, 0.15)';

  if (score >= 67) {
    riskCategory = 'High Risk';
    riskColor = '#FF5B6E';
    riskBg = 'rgba(255, 91, 110, 0.15)';
  } else if (score >= 34) {
    riskCategory = 'Moderate Risk';
    riskColor = '#FFB020';
    riskBg = 'rgba(255, 176, 32, 0.15)';
  }

  const angle = -90 + (score / 100) * 180;
  const needleRad = (angle * Math.PI) / 180;

  const cx = 100;
  const cy = 90;

  const needleLength = 55;
  const nx = cx + needleLength * Math.cos(needleRad);
  const ny = cy + needleLength * Math.sin(needleRad);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        py: 1,
      }}
    >
      <Box sx={{ position: 'relative', width: 220, height: 125 }}>
        <svg viewBox="0 0 200 115" width="100%" height="100%">
          <defs>
            <linearGradient id="lowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C6F26C" />
              <stop offset="100%" stopColor="#2FBFA0" />
            </linearGradient>
            <linearGradient id="modGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFB020" />
              <stop offset="100%" stopColor="#FFD166" />
            </linearGradient>
            <linearGradient id="highGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF5B6E" />
              <stop offset="100%" stopColor="#FF8BA0" />
            </linearGradient>
          </defs>

          {/* Low Risk Arc */}
          <path
            d="M 30,90 A 70,70 0 0,1 65,29"
            fill="none"
            stroke="url(#lowGrad)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Moderate Risk Arc */}
          <path
            d="M 69,26 A 70,70 0 0,1 131,26"
            fill="none"
            stroke="url(#modGrad)"
            strokeWidth="16"
          />

          {/* High Risk Arc */}
          <path
            d="M 135,29 A 70,70 0 0,1 170,90"
            fill="none"
            stroke="url(#highGrad)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Center Pin */}
          <circle cx={cx} cy={cy} r="8" fill="#F5F5F7" />
          <circle cx={cx} cy={cy} r="4" fill={riskColor} />

          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="#F5F5F7"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
        </svg>

        {/* Center score display */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 900, color: riskColor, lineHeight: 1, letterSpacing: '-0.03em' }}>
            {score}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: 10 }}>
            SBI SCORE
          </Typography>
        </Box>
      </Box>

      {/* Pill Risk Status Badge */}
      <Chip
        label={riskCategory.toUpperCase()}
        sx={{
          mt: 1,
          fontWeight: 900,
          fontSize: 11,
          borderRadius: '999px',
          bgcolor: riskBg,
          color: riskColor,
          border: `1px solid ${riskColor}40`,
        }}
      />
    </Box>
  );
};
