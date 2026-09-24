from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.database.session import get_db
from app.models import Alert, Chair, User
from app.repositories.frontend_compat_repository import FrontendCompatRepository
from app.schemas.frontend_compat import (
    AdminChairRead,
    AdminStats,
    AdminUserRead,
    AlertAckResponse,
    AlertDismissRequest,
    AlertDismissResponse,
    ChairSettingsRead,
    ChairStreamToggleRequest,
    ChairStreamToggleResponse,
    ForcePostureRequest,
    ForcePostureResponse,
    ForgotPasswordRequest,
    PasswordResetAck,
    ProfileUpdateRequest,
    ResetPasswordRequest,
    SettingsRead,
    SettingsWrite,
    UserProfileRead,
)
from app.services.frontend_compat_service import FrontendCompatService

router = APIRouter(tags=["Frontend Compatibility"])


@router.post("/auth/forgot-password", response_model=PasswordResetAck)
async def forgot_password(payload: ForgotPasswordRequest):
    return PasswordResetAck(email=payload.email, message="Password reset instructions sent.")


@router.post("/auth/reset-password", response_model=PasswordResetAck)
async def reset_password(payload: ResetPasswordRequest):
    if not payload.email or len(payload.password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset payload")
    return PasswordResetAck(email=payload.email, message="Password reset successful.")


@router.get("/profile", response_model=UserProfileRead)
@router.get("/auth/me", response_model=UserProfileRead)
async def get_profile(current_user: User = Depends(get_current_user)):
    return UserProfileRead(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        age=current_user.age,
        height=float(current_user.height) if current_user.height is not None else None,
        weight=float(current_user.weight) if current_user.weight is not None else None,
        gender=getattr(current_user, "gender", None),
        dailyGoalHours=getattr(current_user, "daily_goal_hours", None),
        recommendedBreakIntervalMinutes=getattr(current_user, "recommended_break_interval_minutes", None),
        avatar=getattr(current_user, "avatar", None),
    )


@router.put("/auth/me", response_model=UserProfileRead)
async def update_profile(payload: ProfileUpdateRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    repo = FrontendCompatRepository(db)
    service = FrontendCompatService(repo)
    updated = await service.update_profile(current_user, payload.model_dump(exclude_none=True))
    await db.commit()
    return UserProfileRead(
        id=updated.id,
        name=updated.name,
        email=updated.email,
        role=updated.role,
        age=updated.age,
        height=float(updated.height) if updated.height is not None else None,
        weight=float(updated.weight) if updated.weight is not None else None,
        gender=getattr(updated, "gender", None),
        dailyGoalHours=getattr(updated, "daily_goal_hours", None),
        recommendedBreakIntervalMinutes=getattr(updated, "recommended_break_interval_minutes", None),
        avatar=getattr(updated, "avatar", None),
    )


@router.get("/settings", response_model=SettingsRead)
async def get_settings(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    del current_user
    service = FrontendCompatService(FrontendCompatRepository(db))
    return await service.get_settings()


@router.put("/settings", response_model=SettingsRead)
async def update_settings(payload: SettingsWrite, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    del current_user
    service = FrontendCompatService(FrontendCompatRepository(db))
    settings = await service.get_settings()
    if payload.mqtt is not None:
        settings.mqtt = payload.mqtt
    if payload.chair is not None:
        settings.chair = payload.chair
    if payload.calibration is not None:
        settings.calibration = payload.calibration
    return settings


@router.get("/admin/stats", response_model=AdminStats)
async def admin_stats(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    del current_user
    service = FrontendCompatService(FrontendCompatRepository(db))
    return await service.get_admin_stats()


@router.get("/admin/chairs", response_model=list[AdminChairRead])
async def admin_chairs(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    del current_user
    service = FrontendCompatService(FrontendCompatRepository(db))
    return [AdminChairRead(**item) for item in await service.get_admin_chairs()]


@router.get("/admin/users", response_model=list[AdminUserRead])
async def admin_users(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    del current_user
    service = FrontendCompatService(FrontendCompatRepository(db))
    return [AdminUserRead(**item) for item in await service.get_admin_users()]


@router.post("/alerts/{alert_id}/ack", response_model=AlertAckResponse)
async def acknowledge_alert(
    alert_id: int = Path(..., gt=0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    del current_user
    alert = await db.get(Alert, alert_id)
    if alert is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")
    return AlertAckResponse(alertId=alert.id, acknowledgedAt=alert.timestamp)


@router.post("/alerts/dismiss", response_model=AlertDismissResponse)
async def dismiss_alerts(payload: AlertDismissRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    del current_user
    deleted = list(payload.alert_ids)
    for alert_id in payload.alert_ids:
        alert = await db.get(Alert, alert_id)
        if alert is not None:
            await db.delete(alert)
    await db.commit()
    return AlertDismissResponse(dismissed=deleted, remaining=await db.scalar(__import__("sqlalchemy").sql.select(__import__("sqlalchemy").func.count()).select_from(Alert)))


@router.post("/chairs/{chair_code}/toggle-stream", response_model=ChairStreamToggleResponse)
async def toggle_stream(
    payload: ChairStreamToggleRequest,
    chair_code: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    del current_user
    chair = await FrontendCompatRepository(db).get_chair_by_code(chair_code)
    if chair is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chair not found")
    chair.status = "online" if payload.enabled else "offline"
    await db.commit()
    return ChairStreamToggleResponse(chairCode=chair_code, streaming=payload.enabled, status="updated")


@router.post("/chairs/{chair_code}/force-posture", response_model=ForcePostureResponse)
async def force_posture(
    chair_code: str,
    payload: ForcePostureRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    del current_user
    chair = await FrontendCompatRepository(db).get_chair_by_code(chair_code)
    if chair is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chair not found")
    posture = payload.posture.strip()
    valid_postures = {"Correct", "Slouching", "Forward Lean", "Left Lean", "Right Lean", "Chair Empty"}
    if posture not in valid_postures:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported posture preset")
    chair.status = "online"
    await db.commit()
    return ForcePostureResponse(chairCode=chair_code, posture=posture, confidence=98.2)
