# Frontend API Contract

## Executive summary

The current React/Vite frontend does not make any real REST or WebSocket calls. In the code under `frontend/src`, there are no `fetch`, `axios`, or `new WebSocket` calls. The app is effectively a mock/demo dashboard that reads static data from `src/services/mockData.js` and keeps session state in `localStorage`.

This means:

- The frontend is not currently wired to the FastAPI backend.
- The backend still exposes a real API contract that the frontend is designed to align with.
- The app’s live telemetry and auth behavior are simulated locally instead of using server endpoints.

## Evidence from the frontend

- `src/context/AuthContext.jsx` stores a mock JWT in `localStorage` and simulates login with `setTimeout`.
- `src/hooks/useSimulatedWebSocket.js` generates telemetry values in JavaScript on an interval instead of connecting to a real WebSocket.
- `src/services/mockData.js` contains the static dashboard state and mock MQTT URL.
- The frontend does not contain any real network client setup.

## 1) REST endpoints used by the frontend

### Actual frontend usage

None. The frontend does not currently call the backend using HTTP.

### Intended backend endpoints for this product

The backend exposes the following routes under `/api/v1`:

| Method | Endpoint | Auth required | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | No | Health check |
| POST | `/api/v1/auth/register` | No | Register new user |
| POST | `/api/v1/auth/login` | No | Login and return JWT |
| GET | `/api/v1/auth/me` | Yes | Get current authenticated user |
| GET | `/api/v1/sensor/latest` | Yes | Latest sensor reading for a chair |
| GET | `/api/v1/sensor/history` | Yes | Historical sensor readings |
| GET | `/api/v1/sensor/by-date` | Yes | Sensor readings filtered by date |
| GET | `/api/v1/posture/current` | Yes | Latest posture classification |
| GET | `/api/v1/posture/history` | Yes | Posture history |
| GET | `/api/v1/sedentary/current` | Yes | Latest sedentary analysis |
| GET | `/api/v1/sedentary/history` | Yes | Sedentary history |
| GET | `/api/v1/alerts` | Yes | Alert list |
| GET | `/api/v1/alerts/latest` | Yes | Latest alert |
| GET | `/api/v1/dashboard/live` | Yes | Combined live dashboard payload |
| GET | `/api/v1/dashboard/latest` | Yes | Alias of live dashboard payload |
| GET | `/api/v1/dashboard/statistics` | Yes | Aggregate dashboard stats |
| GET | `/api/v1/reports/{period}` | Yes | Report data for daily/weekly/monthly |
| WS | `/ws/live` | Yes (JWT in query string) | Live stream for telemetry updates |

## 2) Request JSON structures

### Auth registration

Endpoint: `POST /api/v1/auth/register`

Request body:

```json
{
  "name": "Alice Example",
  "email": "alice@example.com",
  "password": "StrongPass123",
  "age": 30,
  "height": 175,
  "weight": 70,
  "role": "User"
}
```

Validation rules:

- `name`: 2-120 chars
- `email`: valid email
- `password`: 8-128 chars
- `age`: 13-120
- `height`: >0, <=300
- `weight`: >0, <=500
- `role`: `User` or `Admin`

### Auth login

Endpoint: `POST /api/v1/auth/login`

The backend expects OAuth2 form data, not a JSON body:

```http
Content-Type: application/x-www-form-urlencoded

username=alice@example.com&password=StrongPass123
```

Request param names:

- `username`
- `password`

### Protected data requests

Examples:

```http
GET /api/v1/sensor/latest?chair=ESP32-SC-9042
GET /api/v1/dashboard/live?chair=ESP32-SC-9042
GET /api/v1/alerts?chair=ESP32-SC-9042&limit=100
GET /api/v1/reports/weekly?chair=ESP32-SC-9042
```

The chair identifier is passed as a query parameter named `chair`.

## 3) Response JSON structures

### `POST /api/v1/auth/register`

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Alice Example",
    "email": "alice@example.com",
    "role": "User",
    "age": 30,
    "height": 175,
    "weight": 70,
    "created_at": "2026-09-21T12:00:00Z"
  }
}
```

### `POST /api/v1/auth/login`

Same response shape as registration:

```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Alice Example",
    "email": "alice@example.com",
    "role": "User",
    "age": 30,
    "height": 175,
    "weight": 70,
    "created_at": "2026-09-21T12:00:00Z"
  }
}
```

### `GET /api/v1/auth/me`

```json
{
  "id": 1,
  "name": "Alice Example",
  "email": "alice@example.com",
  "role": "User",
  "age": 30,
  "height": 175,
  "weight": 70,
  "created_at": "2026-09-21T12:00:00Z"
}
```

### `GET /api/v1/sensor/latest`

```json
{
  "id": 42,
  "chair_id": 7,
  "pressure1": 31.2,
  "pressure2": 29.5,
  "pressure3": 38.7,
  "pressure4": 34.8,
  "heart_rate": 74,
  "temperature": 36.7,
  "timestamp": "2026-09-21T12:00:00Z"
}
```

### `GET /api/v1/sensor/history`

```json
[
  {
    "id": 41,
    "chair_id": 7,
    "pressure1": 32.1,
    "pressure2": 31.4,
    "pressure3": 39.4,
    "pressure4": 35.9,
    "heart_rate": 73,
    "temperature": 36.6,
    "timestamp": "2026-09-21T11:59:00Z"
  }
]
```

### `GET /api/v1/posture/current`

```json
{
  "id": 88,
  "chair_id": 7,
  "posture_type": "Correct",
  "confidence": 96.5,
  "timestamp": "2026-09-21T12:00:00Z"
}
```

### `GET /api/v1/sedentary/current`

```json
{
  "id": 12,
  "chair_id": 7,
  "sitting_duration": 52.4,
  "break_count": 2,
  "sedentary_index": 74,
  "risk_level": "Moderate",
  "timestamp": "2026-09-21T12:00:00Z"
}
```

### `GET /api/v1/alerts`

```json
[
  {
    "id": 5,
    "chair_id": 7,
    "alert_type": "prolonged_sitting",
    "message": "You have been sitting for too long.",
    "timestamp": "2026-09-21T12:00:00Z"
  }
]
```

### `GET /api/v1/dashboard/live`

```json
{
  "sensor": {
    "id": 42,
    "chair_id": 7,
    "pressure1": 31.2,
    "pressure2": 29.5,
    "pressure3": 38.7,
    "pressure4": 34.8,
    "heart_rate": 74,
    "temperature": 36.7,
    "timestamp": "2026-09-21T12:00:00Z"
  },
  "posture": {
    "id": 88,
    "chair_id": 7,
    "posture_type": "Correct",
    "confidence": 96.5,
    "timestamp": "2026-09-21T12:00:00Z"
  },
  "sedentary": {
    "id": 12,
    "chair_id": 7,
    "sitting_duration": 52.4,
    "break_count": 2,
    "sedentary_index": 74,
    "risk_level": "Moderate",
    "timestamp": "2026-09-21T12:00:00Z"
  },
  "chair": {
    "id": 7,
    "chair_code": "ESP32-SC-9042",
    "status": "online"
  }
}
```

### `GET /api/v1/reports/{period}`

```json
{
  "period": "weekly",
  "chairId": "ESP32-SC-9042",
  "entries": [
    {
      "id": 1,
      "chair_id": 7,
      "sitting_duration": 420.0,
      "break_count": 8,
      "sedentary_index": 72,
      "risk_level": "Moderate",
      "timestamp": "2026-09-14T00:00:00Z"
    }
  ]
}
```

## 4) WebSocket event names

### Actual WebSocket endpoint

`GET /ws/live?token=<jwt>`

This endpoint does not emit a complex event registry. It accepts a single authenticated connection and then the backend broadcasts one message type:

```json
{
  "type": "live_update",
  "chairId": "ESP32-SC-9042",
  "posture": "Correct",
  "confidence": 96.5,
  "sensor": {
    "chairId": "ESP32-SC-9042",
    "timestamp": "2026-09-21T12:00:00Z",
    "pressure1": 31.2,
    "pressure2": 29.5,
    "pressure3": 38.7,
    "pressure4": 34.8,
    "heartRate": 74,
    "temperature": 36.7
  },
  "sbiScore": 74,
  "riskLevel": "Moderate",
  "alerts": [
    {
      "type": "prolonged_sitting",
      "message": "You have been sitting for too long."
    }
  ]
}
```

### Frontend WebSocket usage

The frontend does not create a real WebSocket client. It instead simulates a live stream in `useSimulatedWebSocket.js` by updating state on a timed interval. There are no frontend event names like `message`, `data`, `connected`, or `status` from a real socket connection.

## 5) Authentication flow

### Current frontend behavior (mocked)

The app does not call the real backend for auth.

Flow in `src/context/AuthContext.jsx`:

1. Reads `smartchair_jwt_token` from `localStorage`.
2. If absent, defaults to a mock value: `mock-jwt-token-9042`.
3. `login(email, password)` waits 800ms and then sets a fake JWT like:
   `jwt-header.<base64(email)>.signature_<timestamp>`
4. It stores the token and user in localStorage.
5. Protected routes are unlocked when `Boolean(token)` is true.

### Intended backend auth flow

The backend expects this real JWT flow:

1. `POST /api/v1/auth/login` with form data (`username`, `password`)
2. Server verifies user credentials against the database.
3. Server returns `access_token` and `user`
4. Client sends authenticated requests with:

```http
Authorization: Bearer <access_token>
```

5. WebSocket clients authenticate via query param:

```http
/ws/live?token=<access_token>
```

6. `GET /api/v1/auth/me` returns the current user for the token.

## 6) Missing backend endpoints

The frontend UI implies several features that are not implemented in the backend as actual endpoints right now.

### Missing user/account-related endpoints

- `POST /api/v1/auth/forgot-password` — frontend has a reset-password modal, but no server route exists.
- `POST /api/v1/auth/reset-password` — no password reset implementation is present.
- `PUT /api/v1/auth/me` or `PUT /api/v1/users/me` — profile editing is implied by the profile/settings screens but not implemented.
- `GET /api/v1/user/profile` — profile data is mocked locally, not provided by backend.

### Missing settings/config endpoints

- `GET /api/v1/settings` — settings page displays MQTT and chair config, but there is no endpoint to load or save device settings.
- `PUT /api/v1/settings` — no route for persisting MQTT chair config.
- `POST /api/v1/chairs/calibrate` — calibration adjustments are displayed in UI but not backed by an API.

### Missing admin endpoints

- `GET /api/v1/admin/stats` — dashboard shows total chairs/users/system stats.
- `GET /api/v1/admin/chairs` — admin table shows chair inventory and statuses.
- `GET /api/v1/admin/users` — admin users list is not backed by a route.

### Missing alert-management endpoints

- `POST /api/v1/alerts/{id}/ack` — alert handling is represented in UI, but not implemented.
- `POST /api/v1/alerts/dismiss` — not present.

### Missing live device command endpoints

- `POST /api/v1/chairs/{chairId}/toggle-stream` — the live monitor has stream control buttons, but no API to start/stop a device stream.
- `POST /api/v1/chairs/{chairId}/force-posture` — test posture presets are demo-only and do not hit a backend endpoint.

## Bottom line

The frontend is currently a mock/demo implementation. It uses no real API calls, and all telemetry/auth state is simulated in-browser. The backend, however, does implement a coherent JWT-based API with live WebSocket streaming centered on `/api/v1/*` and `/ws/live`.

The clean contract to target if the frontend is connected to the backend is:

- REST API under `/api/v1`
- JWT auth via `/api/v1/auth/login` and `Authorization: Bearer ...`
- Live stream on `/ws/live?token=...`
- Broadcast payload type: `live_update`
- Data shapes defined by the backend Pydantic schemas in `backend/app/schemas/`
