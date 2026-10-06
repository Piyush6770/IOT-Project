/**
 * Smart Chair IoT API Service
 * Connects frontend directly to FastAPI backend endpoints with real JWT authentication & telemetry.
 */

const API_BASE = '/api/v1';

// Token helper
export const getStoredToken = () => localStorage.getItem('smartchair_jwt_token');
export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('smartchair_jwt_token', token);
  } else {
    localStorage.removeItem('smartchair_jwt_token');
  }
};

async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(endpoint, config);
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        console.warn('API returned 401 Unauthorized');
      }
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
      }
      const error = new Error(errorData.detail || 'API request failed');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    return await response.json();
  } catch (err) {
    // If backend is not reached, throw error so caller can handle gracefully
    throw err;
  }
}

export const api = {
  // ==========================================
  // Authentication & Profile
  // ==========================================
  async login(username, password) {
    // Backend expects OAuth2 form data
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const data = await apiRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (data.access_token) {
      setStoredToken(data.access_token);
      if (data.user) {
        localStorage.setItem('smartchair_user', JSON.stringify(data.user));
      }
    }
    return data;
  },

  async register(userData) {
    const data = await apiRequest(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (data.access_token) {
      setStoredToken(data.access_token);
      if (data.user) {
        localStorage.setItem('smartchair_user', JSON.stringify(data.user));
      }
    }
    return data;
  },

  async getMe() {
    return await apiRequest(`${API_BASE}/auth/me`);
  },

  async updateProfile(payload) {
    return await apiRequest(`${API_BASE}/auth/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  async forgotPassword(email) {
    return await apiRequest(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(email, password) {
    return await apiRequest(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  // ==========================================
  // Sensor & Telemetry Endpoints
  // ==========================================
  async getLatestSensor(chair = 'CHAIR001') {
    return await apiRequest(`${API_BASE}/sensor/latest?chair=${encodeURIComponent(chair)}`);
  },

  async getSensorHistory(chair = 'CHAIR001', limit = 100, startDate = null, endDate = null) {
    let url = `${API_BASE}/sensor/history?chair=${encodeURIComponent(chair)}&limit=${limit}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    return await apiRequest(url);
  },

  async getCurrentPosture(chair = 'CHAIR001') {
    return await apiRequest(`${API_BASE}/posture/current?chair=${encodeURIComponent(chair)}`);
  },

  async getPostureHistory(chair = 'CHAIR001', limit = 100) {
    return await apiRequest(`${API_BASE}/posture/history?chair=${encodeURIComponent(chair)}&limit=${limit}`);
  },

  async getCurrentSedentary(chair = 'CHAIR001') {
    return await apiRequest(`${API_BASE}/sedentary/current?chair=${encodeURIComponent(chair)}`);
  },

  async getSedentaryHistory(chair = 'CHAIR001', limit = 100) {
    return await apiRequest(`${API_BASE}/sedentary/history?chair=${encodeURIComponent(chair)}&limit=${limit}`);
  },

  // ==========================================
  // Alerts Endpoints
  // ==========================================
  async getAlerts(chair = 'CHAIR001', limit = 50) {
    return await apiRequest(`${API_BASE}/alerts?chair=${encodeURIComponent(chair)}&limit=${limit}`);
  },

  async getLatestAlert(chair = 'CHAIR001') {
    return await apiRequest(`${API_BASE}/alerts/latest?chair=${encodeURIComponent(chair)}`);
  },

  async acknowledgeAlert(alertId) {
    return await apiRequest(`${API_BASE}/alerts/${alertId}/ack`, {
      method: 'POST',
    });
  },

  async dismissAlerts(alertIds) {
    return await apiRequest(`${API_BASE}/alerts/dismiss`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alert_ids: alertIds }),
    });
  },

  // ==========================================
  // Dashboard & Reports
  // ==========================================
  async getLiveDashboard(chair = 'CHAIR001') {
    return await apiRequest(`${API_BASE}/dashboard/live?chair=${encodeURIComponent(chair)}`);
  },

  async getDashboardStatistics(chair = 'CHAIR001') {
    return await apiRequest(`${API_BASE}/dashboard/statistics?chair=${encodeURIComponent(chair)}`);
  },

  async getReports(period = 'weekly', chair = 'CHAIR001') {
    return await apiRequest(`${API_BASE}/reports/${period}?chair=${encodeURIComponent(chair)}`);
  },

  // ==========================================
  // Settings & Admin
  // ==========================================
  async getSettings() {
    return await apiRequest(`${API_BASE}/settings`);
  },

  async updateSettings(settingsPayload) {
    return await apiRequest(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsPayload),
    });
  },

  async getAdminStats() {
    return await apiRequest(`${API_BASE}/admin/stats`);
  },

  async getAdminChairs() {
    return await apiRequest(`${API_BASE}/admin/chairs`);
  },

  async getAdminUsers() {
    return await apiRequest(`${API_BASE}/admin/users`);
  },

  // ==========================================
  // Direct Hardware & MQTT Verification
  // ==========================================
  async getDeviceInfo(deviceId = 'CHAIR001') {
    return await apiRequest(`/device/${encodeURIComponent(deviceId)}`);
  },

  async getMqttStatus() {
    return await apiRequest('/mqtt/status');
  },

  async getHealth() {
    return await apiRequest('/health');
  },

  async toggleChairStream(chairCode, enabled) {
    return await apiRequest(`${API_BASE}/chairs/${encodeURIComponent(chairCode)}/toggle-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
  },

  async forcePosture(chairCode, posture) {
    return await apiRequest(`${API_BASE}/chairs/${encodeURIComponent(chairCode)}/force-posture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ posture }),
    });
  },
};
