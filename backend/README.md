# Smart Chair IoT Backend

FastAPI backend for real-time smart-chair telemetry, posture analysis, sedentary behaviour scoring, alerts, and WebSocket updates.

## Architecture

- `app/api/v1`: JWT-protected REST endpoints under `/api/v1`
- `app/services`: posture, SBI, alert, and ingestion business logic
- `app/mqtt`: paho MQTT subscriber for EMQX topic `smartchair/sensor`
- `app/websocket`: live broadcast channel at `/ws/live`
- `app/database` and `app/models`: async SQLAlchemy models for Supabase PostgreSQL
- `alembic`: schema migrations

MQTT payloads accept the ESP32 contract with camelCase aliases (`chairId`, `heartRate`). Every accepted reading is persisted, classified, scored, checked for alerts, and broadcast as one `live_update` message.

## Local setup

1. Create a Python 3.12 virtual environment and install dependencies:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. Copy `.env.example` to `.env` and set the database URL, EMQX connection values, and a long random `JWT_SECRET`. The included local setup uses SQLite and does not require PostgreSQL or Docker. For production, use a Supabase transaction-pooler PostgreSQL URL.

3. Apply the schema:

   ```powershell
   alembic upgrade head
   ```

4. Run the API:

   ```powershell
   uvicorn app.main:app --reload
   ```

The API is available at `http://localhost:8000`, OpenAPI docs at `/docs`, and health at `/health`.

## Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login` with form fields `username` and `password`
- `GET /api/v1/auth/me`

Send `Authorization: Bearer <access_token>` to all protected endpoints. Public registration always creates a `User`; provision `Admin` accounts through a controlled database or administrative workflow. Administrative enforcement is available through `require_admin` for admin-only routes.

## Monitoring APIs

All monitoring routes accept a `chair` query parameter containing the ESP32 `chairId`: `/sensor/latest`, `/sensor/history`, `/sensor/by-date`, `/posture/current`, `/posture/history`, `/sedentary/current`, `/sedentary/history`, `/alerts`, `/alerts/latest`, `/dashboard/live`, `/dashboard/latest`, `/dashboard/statistics`, and `/reports/daily|weekly|monthly`.

WebSocket clients connect to `/ws/live` and receive current posture, sensor values, `sbiScore`, `riskLevel`, and generated alerts whenever MQTT data arrives.
