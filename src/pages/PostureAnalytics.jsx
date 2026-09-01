import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import HistoryIcon from '@mui/icons-material/History';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';

import { postureDistribution, postureTimeline } from '../services/mockData';
import { useTheme } from '@mui/material/styles';

const fintechPostureDistribution = [
  { name: 'Correct Sitting', value: 62, color: '#C6F26C' }, // Lime-green
  { name: 'Slouching', value: 18, color: '#FF5B6E' }, // Warm Coral
  { name: 'Left Lean', value: 8, color: '#FFB020' }, // Yellow
  { name: 'Right Lean', value: 7, color: '#9B7BFF' }, // Purple
  { name: 'Forward Lean', value: 5, color: '#4D9CFF' }, // Blue
];

export const PostureAnalytics = () => {
  const theme = useTheme();
  const postureQualityScore = 85;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Bold Ethereal Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.03em' }}>
              Posture Analytics
            </Typography>
            <Chip
              label="BIOMECHANICS"
              sx={{ bgcolor: 'rgba(155, 123, 255, 0.2)', color: '#9B7BFF', fontWeight: 900, fontSize: 11 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
            Posture State Split, Centered Quality Donut & Chronological Activity Log
          </Typography>
        </Box>
      </Box>

      {/* Row 1: Donut Chart Card (Mapped to Expense Split Donut) + Quality Score */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Centered Donut Chart Card */}
        <Grid item xs={12} md={7} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Posture State Split
                </Typography>
                <Chip label="Today's Session" size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#9A9AA5', fontWeight: 700 }} />
              </Box>

              <Grid container spacing={2} alignItems="center">
                {/* Left: Donut Chart with Center Total Value */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ position: 'relative', width: '100%', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fintechPostureDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {fintechPostureDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: '#17171F',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: 14,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text inside Donut */}
                    <Box
                      sx={{
                        position: 'absolute',
                        textAlign: 'center',
                        pointerEvents: 'none',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#C6F26C', lineHeight: 1 }}>
                        {postureQualityScore}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9A9AA5', fontWeight: 800, fontSize: 10 }}>
                        QUALITY
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Right: Category Legend List */}
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                    {fintechPostureDistribution.map((item) => (
                      <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1.2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: item.color }}>
                          {item.value}%
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quality Score Breakdown Card */}
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #9B7BFF 0%, #5B4CFF 100%)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>
                  POSTURE ALIGNMENT GRADE
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, my: 1 }}>
                  Grade A
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  62% of working hours maintained in optimal neutral spine alignment.
                </Typography>
              </Box>

              <Box sx={{ mt: 3, p: 2, borderRadius: 3, bgcolor: 'rgba(0, 0, 0, 0.2)' }}>
                <Grid container spacing={1} sx={{ textAlign: 'left' }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Pelvic Stability</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>92% Stable</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Lumbar Support</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>88% Contact</Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Chronological Posture Activity Log */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Chronological Posture Log Activity
            </Typography>
            <Chip label="Today's Timeline" size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#9A9AA5', fontWeight: 800 }} />
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, bgcolor: 'transparent' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>TIME</TableCell>
                  <TableCell>DETECTED POSTURE</TableCell>
                  <TableCell>DURATION</TableCell>
                  <TableCell>ERGONOMIC IMPLICATION</TableCell>
                  <TableCell align="right">STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {postureTimeline.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{row.time}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{row.posture}</TableCell>
                    <TableCell>{row.duration}</TableCell>
                    <TableCell sx={{ color: '#9A9AA5', fontSize: 13 }}>
                      {row.posture === 'Correct'
                        ? 'Balanced spinal column alignment'
                        : row.posture === 'Slouching'
                        ? 'Increased L4/L5 disc compression'
                        : row.posture === 'Chair Empty'
                        ? 'Active micro-break taken'
                        : 'Asymmetric lateral lumbar pressure'}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={row.status.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 900,
                          fontSize: 10,
                          bgcolor: row.status === 'optimal' || row.status === 'success' ? 'rgba(47, 191, 160, 0.15)' : 'rgba(255, 91, 110, 0.15)',
                          color: row.status === 'optimal' || row.status === 'success' ? '#2FBFA0' : '#FF5B6E',
                        }}
                      />
                    </TableCell>
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
