import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TimerIcon from '@mui/icons-material/Timer';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ScaleIcon from '@mui/icons-material/Scale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { alertsFeed } from '../services/mockData';

export const Alerts = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [alertsList, setAlertsList] = useState(alertsFeed);

  const getAlertIcon = (iconName, severity) => {
    const color = severity === 'high' ? '#FF5B6E' : severity === 'medium' ? '#FFB020' : '#2FBFA0';
    switch (iconName) {
      case 'Timer': return <TimerIcon sx={{ color, fontSize: 24 }} />;
      case 'Accessibility': return <AccessibilityNewIcon sx={{ color, fontSize: 24 }} />;
      case 'Scale': return <ScaleIcon sx={{ color, fontSize: 24 }} />;
      case 'CheckCircle': return <CheckCircleIcon sx={{ color, fontSize: 24 }} />;
      default: return <SettingsIcon sx={{ color, fontSize: 24 }} />;
    }
  };

  const getSeverityPill = (severity) => {
    switch (severity) {
      case 'high':
        return <Chip label="HIGH RISK" size="small" sx={{ bgcolor: 'rgba(255, 91, 110, 0.15)', color: '#FF5B6E', border: '1px solid #FF5B6E40', fontWeight: 900, fontSize: 10 }} />;
      case 'medium':
        return <Chip label="MODERATE" size="small" sx={{ bgcolor: 'rgba(255, 176, 32, 0.15)', color: '#FFB020', border: '1px solid #FFB02040', fontWeight: 900, fontSize: 10 }} />;
      default:
        return <Chip label="GOAL / INFO" size="small" sx={{ bgcolor: 'rgba(47, 191, 160, 0.15)', color: '#2FBFA0', border: '1px solid #2FBFA040', fontWeight: 900, fontSize: 10 }} />;
    }
  };

  const handleDismiss = (id) => {
    setAlertsList((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredAlerts = alertsList.filter((item) => {
    const timeMatch = timeFilter === 'all' || item.timeframe === timeFilter;
    const severityMatch = severityFilter === 'all' || item.severity === severityFilter;
    return timeMatch && severityMatch;
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.03em' }}>
            Alert Feed & Activity
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
            Sedentary Thresholds, Posture Drifts & Clinical Recommendations
          </Typography>
        </Box>
      </Box>

      {/* Filter Toolbar */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#9A9AA5', mr: 1 }}>
          TIMEFRAME:
        </Typography>
        {['all', 'today', 'week', 'month'].map((tf) => (
          <Button
            key={tf}
            size="small"
            onClick={() => setTimeFilter(tf)}
            sx={{
              borderRadius: '999px',
              px: 2,
              py: 0.5,
              fontSize: 12,
              fontWeight: 800,
              bgcolor: timeFilter === tf ? '#F5F5F7' : 'rgba(255, 255, 255, 0.05)',
              color: timeFilter === tf ? '#0D0D12' : '#9A9AA5',
            }}
          >
            {tf.toUpperCase()}
          </Button>
        ))}

        <Typography variant="caption" sx={{ fontWeight: 800, color: '#9A9AA5', ml: { sm: 3 }, mr: 1 }}>
          SEVERITY:
        </Typography>
        {['all', 'high', 'medium', 'low'].map((sev) => (
          <Button
            key={sev}
            size="small"
            onClick={() => setSeverityFilter(sev)}
            sx={{
              borderRadius: '999px',
              px: 2,
              py: 0.5,
              fontSize: 12,
              fontWeight: 800,
              bgcolor: severityFilter === sev ? (sev === 'high' ? '#FF5B6E' : sev === 'medium' ? '#FFB020' : '#F5F5F7') : 'rgba(255, 255, 255, 0.05)',
              color: severityFilter === sev ? '#0D0D12' : '#9A9AA5',
            }}
          >
            {sev.toUpperCase()}
          </Button>
        ))}
      </Box>

      {/* Recent Activity Card List */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {filteredAlerts.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)', bgcolor: 'rgba(255, 255, 255, 0.04)' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          bgcolor: item.severity === 'high' ? 'rgba(255, 91, 110, 0.15)' : 'rgba(255, 176, 32, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {getAlertIcon(item.icon, item.severity)}
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                            {item.title}
                          </Typography>
                          {getSeverityPill(item.severity)}
                          <Typography variant="caption" sx={{ color: '#9A9AA5', fontWeight: 600 }}>
                            • {item.timestamp}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button size="small" variant="outlined" sx={{ borderRadius: '999px', fontSize: 12, fontWeight: 700 }}>
                        Action
                      </Button>
                      <Tooltip title="Dismiss">
                        <IconButton onClick={() => handleDismiss(item.id)} size="small">
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Recommendation sub-bar */}
                  <Box sx={{ mt: 2, p: 1.5, px: 2, borderRadius: 3, bgcolor: 'rgba(198, 242, 108, 0.05)', border: '1px border rgba(198, 242, 108, 0.2)' }}>
                    <Typography variant="caption" sx={{ color: '#C6F26C', fontWeight: 700 }}>
                      💡 Recommendation: {item.recommendation}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
