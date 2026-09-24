"""create initial smart chair schema

Revision ID: 0001_initial_schema
Revises:
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("users", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(120), nullable=False), sa.Column("email", sa.String(255), nullable=False, unique=True), sa.Column("password_hash", sa.String(255), nullable=False), sa.Column("role", sa.String(20), nullable=False, server_default="User"), sa.Column("age", sa.Integer()), sa.Column("height", sa.Numeric(6, 2)), sa.Column("weight", sa.Numeric(6, 2)), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_users_email", "users", ["email"])
    op.create_table("chairs", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("chair_code", sa.String(80), nullable=False, unique=True), sa.Column("status", sa.String(20), nullable=False, server_default="offline"), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_chairs_chair_code", "chairs", ["chair_code"])
    for table, columns in {
        "sensor_data": [sa.Column("pressure1", sa.Numeric(10, 2), nullable=False), sa.Column("pressure2", sa.Numeric(10, 2), nullable=False), sa.Column("pressure3", sa.Numeric(10, 2), nullable=False), sa.Column("pressure4", sa.Numeric(10, 2), nullable=False), sa.Column("heart_rate", sa.Numeric(6, 2)), sa.Column("temperature", sa.Numeric(6, 2))],
        "posture_logs": [sa.Column("posture_type", sa.String(40), nullable=False), sa.Column("confidence", sa.Numeric(5, 2), nullable=False)],
        "sedentary_analysis": [sa.Column("sitting_duration", sa.Numeric(10, 2), nullable=False), sa.Column("break_count", sa.Integer(), nullable=False, server_default="0"), sa.Column("sedentary_index", sa.Numeric(5, 2), nullable=False), sa.Column("risk_level", sa.String(20), nullable=False)],
        "alerts": [sa.Column("alert_type", sa.String(50), nullable=False), sa.Column("message", sa.Text(), nullable=False)],
    }.items():
        op.create_table(table, sa.Column("id", sa.Integer(), primary_key=True), sa.Column("chair_id", sa.Integer(), sa.ForeignKey("chairs.id", ondelete="CASCADE"), nullable=False), *columns, sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False))
        op.create_index(f"ix_{table}_chair_id", table, ["chair_id"])
        op.create_index(f"ix_{table}_timestamp", table, ["timestamp"])


def downgrade() -> None:
    for table in ("alerts", "sedentary_analysis", "posture_logs", "sensor_data", "chairs", "users"):
        op.drop_table(table)
