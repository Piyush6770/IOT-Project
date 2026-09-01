import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import { CustomThemeProvider } from './theme/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSimulatedWebSocket } from './hooks/useSimulatedWebSocket';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { SedentaryAnalytics } from './pages/SedentaryAnalytics';
import { PostureAnalytics } from './pages/PostureAnalytics';
import { Alerts } from './pages/Alerts';
import { Reports } from './pages/Reports';
import { UserProfile } from './pages/UserProfile';
import { Settings } from './pages/Settings';
import { AdminPanel } from './pages/AdminPanel';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main Layout Shell with Device Frame Container
const MainLayout = ({ children, sensorProps }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default', // Floating outer environment
        py: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        isOnline={sensorProps.isOnline}
        latency={sensorProps.latency}
      />

      {/* Drawer Sidebar for Mobile/Tablet */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        variant="temporary"
      />

      {/* Large Floating Device Frame Container */}
      <Box
        sx={{
          flexGrow: 1,
          mt: 2,
          bgcolor: 'background.frame',
          borderRadius: { xs: '20px', md: '28px' },
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 24px 70px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 20px 60px rgba(0, 0, 0, 0.08)',
          p: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '1440px',
          mx: 'auto',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const AppRoutes = () => {
  const sensorProps = useSimulatedWebSocket(2000);

  return (
    <Routes>
      {/* Public Unauthenticated Landing Page */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Authenticated Dashboard & Analytics Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout sensorProps={sensorProps}>
              <Dashboard
                sensorData={sensorProps.sensorData}
                history={sensorProps.history}
                isStreaming={sensorProps.isStreaming}
                toggleStreaming={sensorProps.toggleStreaming}
                forcePosture={sensorProps.forcePosture}
              />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/live"
        element={
          <ProtectedRoute>
            <MainLayout sensorProps={sensorProps}>
              <LiveMonitoring
                sensorData={sensorProps.sensorData}
                history={sensorProps.history}
                isStreaming={sensorProps.isStreaming}
                isOnline={sensorProps.isOnline}
                latency={sensorProps.latency}
                toggleStreaming={sensorProps.toggleStreaming}
                toggleOnlineStatus={sensorProps.toggleOnlineStatus}
                forcePosture={sensorProps.forcePosture}
              />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sedentary-analytics"
        element={
          <ProtectedRoute>
            <MainLayout sensorProps={sensorProps}>
              <SedentaryAnalytics currentSbi={sensorProps.sensorData.sbiScore} />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/posture-analytics"
        element={
          <ProtectedRoute>
            <MainLayout sensorProps={sensorProps}>
              <PostureAnalytics />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <MainLayout sensorProps={sensorProps}>
              <Alerts />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <MainLayout sensorProps={sensorProps}>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout sensorProps={sensorProps}>
              <UserProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout sensorProps={sensorProps}>
              <Settings isOnline={sensorProps.isOnline} latency={sensorProps.latency} />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <MainLayout sensorProps={sensorProps}>
              <AdminPanel />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomThemeProvider>
          <AppRoutes />
        </CustomThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
