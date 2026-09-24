import React from 'react';
import { Box, Typography } from '@mui/material';
import { ChairLogo } from './ChairLogo';

export const LoadingSplash = ({ message = 'Connecting to Smart Chair Telemetry...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        bgcolor: '#09090D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          animation: 'pulsePulse 1.8s infinite cubic-bezier(0.4, 0, 0.6, 1)',
          '@keyframes pulsePulse': {
            '0%': { transform: 'scale(0.95)', opacity: 0.5 },
            '50%': { transform: 'scale(1.05)', opacity: 1 },
            '100%': { transform: 'scale(0.95)', opacity: 0.5 },
          },
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
          }}
        >
          <ChairLogo size={52} color="#F5F5F7" />
        </Box>
      </Box>

      <Typography variant="body2" sx={{ color: '#9A9AA5', fontWeight: 600, mt: 3, letterSpacing: 0.5 }}>
        {message}
      </Typography>
    </Box>
  );
};
