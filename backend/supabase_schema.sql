-- ====================================================================
-- ChairSense (IOT-Project) Supabase Database Schema
-- Project Ref: xgjbavzcsuyfiaxnoqtx
-- ====================================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'User',
    age INTEGER,
    height NUMERIC(6, 2),
    weight NUMERIC(6, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);

-- 2. Chairs table
CREATE TABLE IF NOT EXISTS chairs (
    id SERIAL PRIMARY KEY,
    chair_code VARCHAR(80) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'offline',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_chairs_chair_code ON chairs(chair_code);

-- 3. Sensor Data table
CREATE TABLE IF NOT EXISTS sensor_data (
    id SERIAL PRIMARY KEY,
    chair_id INTEGER NOT NULL REFERENCES chairs(id) ON DELETE CASCADE,
    pressure1 NUMERIC(10, 2) NOT NULL,
    pressure2 NUMERIC(10, 2) NOT NULL,
    pressure3 NUMERIC(10, 2) NOT NULL,
    pressure4 NUMERIC(10, 2) NOT NULL,
    heart_rate NUMERIC(6, 2),
    temperature NUMERIC(6, 2),
    timestamp TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_sensor_data_chair_id ON sensor_data(chair_id);
CREATE INDEX IF NOT EXISTS ix_sensor_data_timestamp ON sensor_data(timestamp);

-- 4. Posture Logs table
CREATE TABLE IF NOT EXISTS posture_logs (
    id SERIAL PRIMARY KEY,
    chair_id INTEGER NOT NULL REFERENCES chairs(id) ON DELETE CASCADE,
    posture_type VARCHAR(40) NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_posture_logs_chair_id ON posture_logs(chair_id);
CREATE INDEX IF NOT EXISTS ix_posture_logs_timestamp ON posture_logs(timestamp);

-- 5. Sedentary Analysis table
CREATE TABLE IF NOT EXISTS sedentary_analysis (
    id SERIAL PRIMARY KEY,
    chair_id INTEGER NOT NULL REFERENCES chairs(id) ON DELETE CASCADE,
    sitting_duration NUMERIC(10, 2) NOT NULL DEFAULT 0,
    break_count INTEGER NOT NULL DEFAULT 0,
    sedentary_index NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_sedentary_analysis_chair_id ON sedentary_analysis(chair_id);
CREATE INDEX IF NOT EXISTS ix_sedentary_analysis_timestamp ON sedentary_analysis(timestamp);

-- 6. Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    chair_id INTEGER NOT NULL REFERENCES chairs(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_alerts_chair_id ON alerts(chair_id);
CREATE INDEX IF NOT EXISTS ix_alerts_timestamp ON alerts(timestamp);

-- Seed default chair if not already present
INSERT INTO chairs (chair_code, status)
VALUES ('CHAIR001', 'offline')
ON CONFLICT (chair_code) DO NOTHING;
