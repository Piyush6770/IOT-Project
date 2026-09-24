import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Paper,
  Alert,
  MenuItem,
  Snackbar,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuth } from '../context/AuthContext';

export const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Alex Morgan',
    email: user?.email || 'alex.morgan@healthiot.org',
    age: user?.age || 28,
    weight: user?.weight || 70,
    height: user?.height || 175,
    gender: user?.gender || 'Male',
    dailyGoalHours: user?.dailyGoalHours || 6.0,
    recommendedBreakIntervalMinutes: user?.recommendedBreakIntervalMinutes || 45,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setSavedSuccess(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'serif' }}>
            User Ergonomic Profile & Biometrics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Personal Anthropometric Parameters Used in Custom SBI Index Calculation
          </Typography>
        </Box>
      </Box>

      {/* Alert Notice on SBI Calculation */}
      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
        <strong>SBI Calibration Note:</strong> Body Mass (Weight), Stature (Height), Age, and Gender directly adjust the Force Sensitive Resistor (FSR) pressure thresholds and cardiovascular strain scaling in the Sedentary Behaviour Index (SBI) algorithm.
      </Alert>

      <Grid container spacing={3}>
        {/* Left Column: Avatar & Quick Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                src={user?.avatar}
                alt={formData.name}
                sx={{
                  width: 110,
                  height: 110,
                  mx: 'auto',
                  mb: 2,
                  border: '3px solid #1FBE8C',
                  boxShadow: '0 8px 24px rgba(31, 190, 140, 0.3)',
                }}
              >
                {formData.name.charAt(0)}
              </Avatar>

              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {formData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {formData.email}
              </Typography>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'left', my: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                  CALCULATED BMI & BIOMETRICS:
                </Typography>

                {/* BMI Formula: weight (kg) / (height(m))^2 */}
                {(() => {
                  const hM = (formData.height || 175) / 100;
                  const bmi = ((formData.weight || 70) / (hM * hM)).toFixed(1);
                  return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Body Mass Index (BMI):
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {bmi} kg/m²
                      </Typography>
                    </Box>
                  );
                })()}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Target Daily Sitting Max:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#3B82F6' }}>
                    {formData.dailyGoalHours} hrs
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Edit Profile Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Update Anthropometric & Goal Parameters
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={handleChange('name')}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Age (Years)"
                      type="number"
                      value={formData.age}
                      onChange={handleChange('age')}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange('weight')}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Height (cm)"
                      type="number"
                      value={formData.height}
                      onChange={handleChange('height')}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Gender"
                      value={formData.gender}
                      onChange={handleChange('gender')}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other / Prefer not to say</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Daily Sitting Limit (Hours)"
                      type="number"
                      inputProps={{ step: 0.5 }}
                      value={formData.dailyGoalHours}
                      onChange={handleChange('dailyGoalHours')}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'right' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{ py: 1.2, px: 4, fontWeight: 700 }}
                  >
                    Save & Re-calibrate SBI Algorithm
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar feedback */}
      <Snackbar open={savedSuccess} autoHideDuration={3000} onClose={() => setSavedSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2, fontWeight: 700 }}>
          User profile updated successfully! SBI baseline thresholds recalculated.
        </Alert>
      </Snackbar>
    </Box>
  );
};
