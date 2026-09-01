import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SensorsIcon from '@mui/icons-material/Sensors';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { ChairLogo } from './ChairLogo';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Live Monitoring', path: '/live', icon: <SensorsIcon />, badge: 'LIVE' },
  { label: 'Sedentary Analytics', path: '/sedentary-analytics', icon: <TimelineIcon />, isCore: true },
  { label: 'Posture Analytics', path: '/posture-analytics', icon: <AccessibilityNewIcon /> },
  { label: 'Alerts & Feed', path: '/alerts', icon: <NotificationsActiveIcon />, count: 3 },
  { label: 'Reports & Export', path: '/reports', icon: <AssessmentIcon /> },
  { label: 'User Profile', path: '/profile', icon: <AccountCircleIcon /> },
  { label: 'Chair Settings', path: '/settings', icon: <SettingsIcon /> },
  { label: 'Admin Panel', path: '/admin', icon: <AdminPanelSettingsIcon /> },
];

export const Sidebar = ({ open, onClose, variant = 'permanent' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleNavClick = (path) => {
    navigate(path);
    if (variant === 'temporary' && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 3 }}>
      <Box sx={{ px: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChairLogo size={24} color="#F5F5F7" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.02em', fontSize: 17 }}>
          Smart Chair
        </Typography>
      </Box>

      <Box sx={{ px: 2.5, py: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 1.2 }}>
          NAVIGATION
        </Typography>
      </Box>

      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: '12px',
                  py: 1.2,
                  px: 2,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(31, 190, 140, 0.15)' : 'rgba(31, 190, 140, 0.1)',
                    color: 'primary.main',
                    fontWeight: 700,
                    borderLeft: '4px solid #1FBE8C',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 36, 69, 0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
                {item.isCore && (
                  <Chip
                    label="CORE"
                    size="small"
                    color="primary"
                    sx={{ height: 18, fontSize: 9, fontWeight: 800, ml: 1 }}
                  />
                )}
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="secondary"
                    sx={{ height: 18, fontSize: 9, fontWeight: 800, ml: 1 }}
                  />
                )}
                {item.count && (
                  <Chip
                    label={item.count}
                    size="small"
                    color="error"
                    sx={{ height: 18, fontSize: 9, fontWeight: 800, ml: 1 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Footer Info inside Sidebar */}
      <Box sx={{ p: 2, m: 1.5, borderRadius: 3, bgcolor: 'background.glass', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Smart Chair IoT v2.4
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
          ESP32 + FSR Sensors + MAX30102
        </Typography>
      </Box>
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          style: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.mode === 'dark' ? '#0B1E3D' : '#FFFFFF',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.mode === 'dark' ? '#0B1E3D' : '#FFFFFF',
          borderRight: `1px solid ${theme.palette.divider}`,
          visibility: open ? 'visible' : 'hidden',
          transition: theme.transitions.create(['width', 'visibility'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
      open={open}
    >
      {drawerContent}
    </Drawer>
  );
};
