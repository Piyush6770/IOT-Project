# Smart Chair IoT

A real-time smart-chair monitoring system with a FastAPI backend and React dashboard. The backend processes MQTT sensor readings, stores telemetry, classifies posture, calculates sedentary risk, generates alerts, and publishes live updates to the frontend.

## Run the backend

Open PowerShell in the project root:

```powershell
cd C:\Users\piyus\IOT

# Install or refresh backend dependencies
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt

# Start the FastAPI API
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Backend URLs:

- API: <http://localhost:8000>
- Swagger documentation: <http://localhost:8000/docs>
- Health check: <http://localhost:8000/health>

The backend reads configuration from `backend/.env`. Local development uses the SQLite database `backend/smartchair.db`, so PostgreSQL is not required. For Supabase/PostgreSQL, replace `DATABASE_URL` with your async connection URL. Set MQTT settings and a strong `JWT_SECRET` before using database-backed features. Apply migrations from `backend` with:

```powershell
..\.venv\Scripts\python.exe -m alembic upgrade head
```

## Run the frontend

Open a second PowerShell window:

```powershell
cd C:\Users\piyus\IOT\frontend
npm install
npm run dev
```

The Vite development server is normally available at <http://localhost:5173>.

Useful frontend commands:

```powershell
npm run build
npm run lint
npm run preview
```

## Project documentation

- Backend setup and API details: [backend/README.md](backend/README.md)
- Frontend setup: [frontend/README.md](frontend/README.md)
- Research-paper authoring prompt: [paperprompt.md](paperprompt.md)
