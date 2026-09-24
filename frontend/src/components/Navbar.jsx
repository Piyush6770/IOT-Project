import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SearchIcon from '@mui/icons-material/Search';
import { ChairLogo } from './ChairLogo';

import { useColorMode } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AboutModal } from './AboutModal';
import { alertsFeed } from '../services/mockData';
import { useNavigate, useLocation } from 'react-router-dom';

const navTabs = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Live Monitor', path: '/live' },
  { label: 'Sedentary Analytics', path: '/sedentary-analytics' },
  { label: 'Posture', path: '/posture-analytics' },
  { label: 'Alerts', path: '/alerts', count: 3 },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
];

export const Navbar = ({ onToggleSidebar, isOnline = true, latency = 24 }) => {
  const { mode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenNotif = (e) => setAnchorElNotif(e.currentTarget);
  const handleCloseNotif = () => setAnchorElNotif(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          color: 'text.primary',
          pt: 1.5,
          pb: 1,
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Toolbar
          sx={{
            justify: 'space-between',
            minHeight: '64px !important',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(18, 18, 24, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '999px',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
            px: { xs: 1.5, sm: 2.5 },
          }}
        >
          {/* Left: Brand Logo & Mobile Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isMobile && (
              <IconButton onClick={onToggleSidebar} edge="start" sx={{ color: 'text.primary' }}>
                <MenuIcon />
              </IconButton>
            )}

            <Box
              onClick={() => navigate('/dashboard')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(18, 18, 24, 0.08)'),
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ChairLogo
                  size={20}
                  color={theme.palette.mode === 'dark' ? '#F5F5F7' : '#121218'}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  fontSize: 18,
                  color: 'text.primary',
                }}
              >
                Smart Chair
              </Typography>
            </Box>
          </Box>

          {/* Center: Pill-shaped Segmented Navigation Capsule (Desktop) */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(9, 9, 13, 0.7)',
                p: 0.6,
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                gap: 0.5,
              }}
            >
              {navTabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <Button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    sx={{
                      borderRadius: '999px',
                      px: 2,
                      py: 0.6,
                      fontSize: 13,
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? '#0D0D12' : '#9A9AA5',
                      bgcolor: isActive ? '#F5F5F7' : 'transparent',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#0D0D12' : '#F5F5F7',
                      },
                    }}
                  >
                    {tab.label}
                    {tab.count && (
                      <Box
                        sx={{
                          ml: 0.8,
                          px: 0.8,
                          py: 0.1,
                          fontSize: 10,
                          fontWeight: 900,
                          borderRadius: '999px',
                          bgcolor: isActive ? '#FF5B6E' : 'rgba(255, 91, 110, 0.2)',
                          color: isActive ? '#FFFFFF' : '#FF5B6E',
                        }}
                      >
                        {tab.count}
                      </Box>
                    )}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Right: Circular Action Buttons & Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Live Connection Chip */}
            <Chip
              icon={
                <CircleIcon
                  sx={{
                    fontSize: '8px !important',
                    color: isOnline ? '#2FBFA0 !important' : '#FF5B6E !important',
                    animation: isOnline ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.4 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.4 },
                    },
                  }}
                />
              }
              label={isOnline ? `${latency}ms` : 'OFFLINE'}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: 11,
                display: { xs: 'none', sm: 'flex' },
                bgcolor: isOnline ? 'rgba(47, 191, 160, 0.12)' : 'rgba(255, 91, 110, 0.12)',
                color: isOnline ? '#2FBFA0' : '#FF5B6E',
                border: `1px solid ${isOnline ? '#2FBFA040' : '#FF5B6E40'}`,
                height: 28,
              }}
            />

            {/* About System Icon */}
            <Tooltip title="About Smart Chair Architecture">
              <IconButton
                onClick={() => setAboutOpen(true)}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  width: 38,
                  height: 38,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' },
                }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {/* Dark / Light Mode Switcher */}
            <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
              <IconButton
                onClick={toggleColorMode}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  width: 38,
                  height: 38,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' },
                }}
              >
                {mode === 'dark' ? <Brightness7Icon sx={{ color: '#FFB020', fontSize: 20 }} /> : <Brightness4Icon sx={{ color: '#121218', fontSize: 20 }} />}
              </IconButton>
            </Tooltip>

            {/* Notification Circular Button */}
            <Tooltip title="Alert Feed">
              <IconButton
                onClick={handleOpenNotif}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  width: 38,
                  height: 38,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' },
                }}
              >
                <Badge badgeContent={3} color="error" variant="dot">
                  <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Circular Profile Avatar */}
            <Tooltip title="User Profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 0.5 }}>
                <Avatar
                  alt={user?.name || 'Dr. Alex Morgan'}
                  src={user?.avatar}
                  sx={{
                    width: 38,
                    height: 38,
                    border: '2px solid #C6F26C',
                  }}
                >
                  {user?.name?.charAt(0) || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Popover */}
      <Popover
        open={Boolean(anchorElNotif)}
        anchorEl={anchorElNotif}
        onClose={handleCloseNotif}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          style: { width: 340, borderRadius: 20, marginTop: 12, padding: 12, backgroundColor: '#17171F' },
        }}
      >
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Recent Ergonomic Alerts
          </Typography>
          <Chip label="3 Unread" size="small" color="error" sx={{ height: 20, fontSize: 10, fontWeight: 900 }} />
        </Box>
        <Divider sx={{ my: 1 }} />
        <List sx={{ p: 0, maxHeight: 300, overflowY: 'auto' }}>
          {alertsFeed.slice(0, 3).map((item) => (
            <ListItem
              key={item.id}
              button
              onClick={() => {
                handleCloseNotif();
                navigate('/alerts');
              }}
              sx={{ borderRadius: 3, mb: 1, bgcolor: 'rgba(255, 255, 255, 0.03)' }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <WarningAmberIcon sx={{ color: item.severity === 'high' ? '#FF5B6E' : '#FFB020', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" sx={{ fontWeight: 700 }}>{item.title}</Typography>}
                secondary={<Typography variant="caption" color="text.secondary">{item.description}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </Popover>

      {/* User Avatar Menu */}
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          style: { width: 220, borderRadius: 16, marginTop: 12, padding: 8, backgroundColor: '#17171F' },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {user?.name || 'Dr. Alex Morgan'}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {user?.email || 'alex.morgan@healthiot.org'}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={() => handleNavigate('/profile')} sx={{ borderRadius: 2 }}>
          <ListItemIcon>
            <PersonOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="User Profile" />
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/settings')} sx={{ borderRadius: 2 }}>
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Chair Settings" />
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, color: '#FF5B6E' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#FF5B6E' }} />
          </ListItemIcon>
          <ListItemText primary="Logout Session" />
        </MenuItem>
      </Menu>

      {/* About System Modal */}
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
};
