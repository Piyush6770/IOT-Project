import React from 'react';
import { Box } from '@mui/material';

export const ChairLogo = ({ size = 20, color = 'currentColor', sx = {}, className = '' }) => {
  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      sx={{
        width: size,
        height: size,
        color: color,
        fill: 'currentColor',
        display: 'block',
        flexShrink: 0,
        ...sx,
      }}
    >
      <g transform="translate(10, 6) scale(0.82)">
        {/* High-back Ergonomic Backrest */}
        <path d="M 32,10 C 27,10 26,13 27,20 L 33,46 C 33.5,49 36,51 40,51 L 55,48.5 C 59,48 60,45 59,41 L 52,15 C 51,11 47,10 32,10 Z" />
        {/* Left Armrest */}
        <path d="M 24,34 C 18,34 16,39 17,45 C 18,50 23,53 28,51 C 29.5,50 30,48.5 29,47 C 27.5,45.5 25,44 24.5,41 C 24,38.5 26,37 28,37 L 31,37 L 30,34 Z" />
        {/* Right Armrest */}
        <path d="M 56,34 C 62,34 71,37 71,43 C 71,48 66,50 63,49 C 61.5,48 61,46.5 62,45 C 63.5,43.5 65,42 64.5,39.5 C 64,38 61,37 57,37 L 54,37 L 55,34 Z" />
        {/* Seat Cushion */}
        <path d="M 28,49 C 25,49 24,51 26,53.5 C 28,56 32,59 44,59 C 58,59 71,55 72,51 C 72.5,48.5 70.5,47 66,47 L 34,48 C 30,48 28,48.5 28,49 Z" />
        {/* Gas Lift Stem */}
        <path d="M 44,59 L 54,59 L 52,66 L 46,66 Z" />
        <path d="M 36,63 L 48,63 L 47,66 L 35,66 Z" />
        <path d="M 47,66 L 51,66 L 50,78 L 48,78 Z" />
        {/* 5-Star Base Legs */}
        <path d="M 49,76 L 70,82 L 68,85 L 48,79 Z" />
        <path d="M 49,76 L 28,82 L 29,85 L 48,79 Z" />
        <path d="M 49,76 L 59,87 L 56,89 L 48,79 Z" />
        <path d="M 49,76 L 39,87 L 41,89 L 48,79 Z" />
        <path d="M 48,76 L 48,90 L 51,90 L 51,76 Z" />
        {/* Castor Wheels */}
        <circle cx="70" cy="85" r="4" />
        <circle cx="28" cy="85" r="4" />
        <circle cx="58" cy="90" r="4" />
        <circle cx="39" cy="90" r="4" />
        <circle cx="49.5" cy="92.5" r="4" />
      </g>
    </Box>
  );
};
