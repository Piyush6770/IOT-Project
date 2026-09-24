from datetime import datetime
from decimal import Decimal
from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="User")
    age: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[Decimal | None] = mapped_column(Numeric(6, 2))
    weight: Mapped[Decimal | None] = mapped_column(Numeric(6, 2))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Chair(Base):
    __tablename__ = "chairs"
    id: Mapped[int] = mapped_column(primary_key=True)
    chair_code: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(20), default="offline")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class SensorData(Base):
    __tablename__ = "sensor_data"
    id: Mapped[int] = mapped_column(primary_key=True)
    chair_id: Mapped[int] = mapped_column(ForeignKey("chairs.id", ondelete="CASCADE"), index=True)
    pressure1: Mapped[float] = mapped_column(Numeric(10, 2))
    pressure2: Mapped[float] = mapped_column(Numeric(10, 2))
    pressure3: Mapped[float] = mapped_column(Numeric(10, 2))
    pressure4: Mapped[float] = mapped_column(Numeric(10, 2))
    heart_rate: Mapped[float | None] = mapped_column(Numeric(6, 2))
    temperature: Mapped[float | None] = mapped_column(Numeric(6, 2))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class PostureLog(Base):
    __tablename__ = "posture_logs"
    id: Mapped[int] = mapped_column(primary_key=True)
    chair_id: Mapped[int] = mapped_column(ForeignKey("chairs.id", ondelete="CASCADE"), index=True)
    posture_type: Mapped[str] = mapped_column(String(40))
    confidence: Mapped[float] = mapped_column(Numeric(5, 2))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class SedentaryAnalysis(Base):
    __tablename__ = "sedentary_analysis"
    id: Mapped[int] = mapped_column(primary_key=True)
    chair_id: Mapped[int] = mapped_column(ForeignKey("chairs.id", ondelete="CASCADE"), index=True)
    sitting_duration: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    break_count: Mapped[int] = mapped_column(Integer, default=0)
    sedentary_index: Mapped[float] = mapped_column(Numeric(5, 2))
    risk_level: Mapped[str] = mapped_column(String(20))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class Alert(Base):
    __tablename__ = "alerts"
    id: Mapped[int] = mapped_column(primary_key=True)
    chair_id: Mapped[int] = mapped_column(ForeignKey("chairs.id", ondelete="CASCADE"), index=True)
    alert_type: Mapped[str] = mapped_column(String(50))
    message: Mapped[str] = mapped_column(Text)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
