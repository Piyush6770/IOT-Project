import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { ChairLogo } from '../components/ChairLogo';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('alex.morgan@healthiot.org');
  const [password, setPassword] = useState('smartchair2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setResetOpen(false);
    }, 2500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 30%, #0F2445 0%, #071326 100%)'
            : 'radial-gradient(circle at 50% 30%, #E2E8F0 0%, #F4F7FA 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 20px 50px rgba(0, 0, 0, 0.6)'
              : '0 20px 50px rgba(15, 36, 69, 0.12)',
        }}
      >
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              <ChairLogo size={48} color="#F5F5F7" />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.02em' }}>
              Smart Chair
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Real-Time Sedentary & Ergonomic Analytics
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Remember Me</Typography>}
              />
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => setResetOpen(true)}
                sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'none' }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2, py: 1.4, fontSize: 16, fontWeight: 700 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login to Dashboard'}
            </Button>
          </form>

          <Box sx={{ mt: 3, pt: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Demo Credentials Pre-filled • ESP32 Smart Chair IoT Platform
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Forgot Password Modal */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} maxWidth="xs" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Reset Password</DialogTitle>
        <DialogContent>
          {resetSent ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              Password reset link dispatched to {resetEmail || email}! Check your inbox.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter your registered healthcare account email address to receive password reset instructions.
              </Typography>
              <TextField
                fullWidth
                label="Registered Email"
                type="email"
                value={resetEmail || email}
                onChange={(e) => setResetEmail(e.target.value)}
                margin="dense"
              />
            </>
          )}
        </DialogContent>
        {!resetSent && (
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setResetOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleResetPassword} variant="contained">
              Send Reset Link
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};
