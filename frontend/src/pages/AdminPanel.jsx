import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ChairIcon from '@mui/icons-material/Chair';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { adminData } from '../services/mockData';
import { api } from '../services/api';

export const AdminPanel = ({ sensorData, isOnline = true }) => {
  const [chairs, setChairs] = useState(adminData.chairs);
  const [users, setUsers] = useState(adminData.users);
  const [stats, setStats] = useState({
    totalChairs: adminData.stats.totalChairs,
    activeChairs: adminData.stats.activeChairs,
    totalUsers: adminData.stats.totalUsers,
    activeAlerts: adminData.stats.activeAlerts,
  });

  React.useEffect(() => {
    const loadAdminFleet = async () => {
      try {
        const [adminStats, adminChairsList, adminUsersList] = await Promise.allSettled([
          api.getAdminStats(),
          api.getAdminChairs(),
          api.getAdminUsers(),
        ]);

        if (adminStats.status === 'fulfilled' && adminStats.value) {
          setStats(adminStats.value);
        }
        if (adminChairsList.status === 'fulfilled' && adminChairsList.value?.length > 0) {
          setChairs(adminChairsList.value);
        }
        if (adminUsersList.status === 'fulfilled' && adminUsersList.value?.length > 0) {
          setUsers(adminUsersList.value);
        }
      } catch {
        // Fallback
      }
    };
    loadAdminFleet();
  }, []);

  const dynamicChairs = React.useMemo(() => {
    return chairs.map((c) => {
      if (c.id === 'CHAIR001') {
        const occupiedStatus = sensorData?.isOccupied ? 'Online (Occupied)' : 'Online (Vacant)';
        return {
          ...c,
          status: isOnline ? occupiedStatus : 'Offline',
          battery: sensorData?.rssi ? `${sensorData.rssi} dBm` : c.battery,
        };
      }
      return c;
    });
  }, [chairs, sensorData, isOnline]);

  const dynamicStats = React.useMemo(() => ({
    ...stats,
    activeChairs: isOnline ? Math.max(stats.activeChairs, 1) : Math.max(0, stats.activeChairs - 1),
    activeAlerts: sensorData?.breakReminderActive ? stats.activeAlerts + 1 : stats.activeAlerts,
  }), [stats, isOnline, sensorData?.breakReminderActive]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'serif' }}>
              System Admin & Fleet Management
            </Typography>
            <Chip label="ADMIN PRIVILEGES" color="error" sx={{ fontWeight: 800, fontSize: 11 }} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enterprise User Roles, Smart Chair Fleet Allocation & Supabase IoT Cloud Health
          </Typography>
        </Box>

        <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ fontWeight: 700 }}>
          Deploy New Chair
        </Button>
      </Box>

      {/* Top Admin Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                TOTAL DEPLOYED CHAIRS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', my: 0.5 }}>
                {dynamicStats.totalChairs}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dynamicStats.activeChairs} Active • {(dynamicStats.totalChairs - dynamicStats.activeChairs) || 0} Offline
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                REGISTERED HEALTHCARE USERS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#3B82F6', my: 0.5 }}>
                {dynamicStats.totalUsers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Across 5 Clinical & Research Labs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                TELEMETRY STREAM RATE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#F59E0B', my: 0.5 }}>
                120 <span style={{ fontSize: 16 }}>msg/s</span>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supabase + Spring Boot Ingestion
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                SYSTEM CLOUD UPTIME
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main', my: 0.5 }}>
                {adminData.stats.systemUptime}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                SLA Compliance Verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Chair Fleet Management Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ChairIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Smart Chair Fleet Management
              </Typography>
            </Box>
            <Chip label={`${dynamicChairs.length} Registered Nodes`} size="small" variant="outlined" />
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>CHAIR ID</TableCell>
                  <TableCell>LOCATION / DEPT</TableCell>
                  <TableCell>ASSIGNED USER</TableCell>
                  <TableCell>BATTERY / RSSI</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dynamicChairs.map((chair) => (
                  <TableRow key={chair.id} hover>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{chair.id}</TableCell>
                    <TableCell>{chair.location}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{chair.user}</TableCell>
                    <TableCell>{chair.battery}</TableCell>
                    <TableCell>
                      <Chip
                        label={chair.status}
                        size="small"
                        color={chair.status.startsWith('Online') ? 'success' : chair.status === 'Offline' ? 'error' : 'default'}
                        sx={{ fontWeight: 700, fontSize: 11 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Chair Config">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Unassign Chair">
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Row 3: User Management Table */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PeopleIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                User Account & Role Management
              </Typography>
            </Box>
            <Button variant="outlined" size="small" startIcon={<AddIcon />}>
              Add User
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>USER ID</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>SYSTEM ROLE</TableCell>
                  <TableCell>ASSIGNED CHAIR</TableCell>
                  <TableCell align="right">STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((usr) => (
                  <TableRow key={usr.id} hover>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{usr.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{usr.name}</TableCell>
                    <TableCell>{usr.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={usr.role}
                        size="small"
                        color={usr.role === 'Admin' ? 'error' : 'primary'}
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: 11 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{usr.chairId}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={usr.status}
                        size="small"
                        color={usr.status === 'Active' ? 'success' : 'default'}
                        sx={{ fontWeight: 700, fontSize: 11 }}
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
