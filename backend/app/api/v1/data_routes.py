from datetime import date, datetime, time, timedelta, timezone
from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import get_current_user
from app.database.session import get_db
from app.models import Alert, Chair, PostureLog, SensorData, SedentaryAnalysis, User
from app.repositories.sensor_repository import SensorRepository
from app.repositories.time_series_repository import TimeSeriesRepository
from app.schemas.common import AlertRead, PostureRead, SedentaryRead, SensorRead

router = APIRouter(tags=["Monitoring"])


async def chair_for(db: AsyncSession, chair_code: str) -> Chair:
    chair = await db.scalar(select(Chair).where(Chair.chair_code == chair_code))
    if chair is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Chair not found")
    return chair


def bounds(start_date: date | None, end_date: date | None):
    start = datetime.combine(start_date, time.min, tzinfo=timezone.utc) if start_date else None
    end = datetime.combine(end_date + timedelta(days=1), time.min, tzinfo=timezone.utc) if end_date else None
    return start, end


@router.get("/sensor/latest", response_model=SensorRead | None)
async def sensor_latest(chair: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    item = await SensorRepository(db).latest((await chair_for(db, chair)).id)
    return item


@router.get("/sensor/history", response_model=list[SensorRead])
@router.get("/sensor/by-date", response_model=list[SensorRead])
async def sensor_history(chair: str, start_date: date | None = None, end_date: date | None = None, limit: int = Query(100, ge=1, le=1000), db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    target = await chair_for(db, chair)
    start, end = bounds(start_date, end_date)
    return await SensorRepository(db).history(target.id, start, end, limit)


@router.get("/posture/current", response_model=PostureRead | None)
async def posture_current(chair: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    return await TimeSeriesRepository(db).latest_posture((await chair_for(db, chair)).id)


@router.get("/posture/history", response_model=list[PostureRead])
async def posture_history(chair: str, limit: int = Query(100, ge=1, le=1000), db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    return await TimeSeriesRepository(db).posture_history((await chair_for(db, chair)).id, limit)


@router.get("/sedentary/current", response_model=SedentaryRead | None)
async def sedentary_current(chair: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    return await TimeSeriesRepository(db).latest_sedentary((await chair_for(db, chair)).id)


@router.get("/sedentary/history", response_model=list[SedentaryRead])
async def sedentary_history(chair: str, limit: int = Query(100, ge=1, le=1000), db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    return await TimeSeriesRepository(db).sedentary_history((await chair_for(db, chair)).id, limit)


@router.get("/alerts", response_model=list[AlertRead])
async def alerts(chair: str, limit: int = Query(100, ge=1, le=1000), db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    return await TimeSeriesRepository(db).alerts((await chair_for(db, chair)).id, limit)


@router.get("/alerts/latest", response_model=AlertRead | None)
async def latest_alert(chair: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    target = await chair_for(db, chair)
    return await db.scalar(select(Alert).where(Alert.chair_id == target.id).order_by(desc(Alert.timestamp)).limit(1))


@router.get("/dashboard/live")
async def dashboard_live(chair: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    target = await chair_for(db, chair)
    sensor = await SensorRepository(db).latest(target.id)
    posture = await TimeSeriesRepository(db).latest_posture(target.id)
    sedentary = await TimeSeriesRepository(db).latest_sedentary(target.id)
    return {"sensor": sensor, "posture": posture, "sedentary": sedentary, "chair": target}


@router.get("/dashboard/latest")
async def dashboard_latest(chair: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    return await dashboard_live(chair, db, _)


@router.get("/dashboard/statistics")
async def dashboard_statistics(chair: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    target = await chair_for(db, chair)
    posture_rows = list(await db.scalars(select(PostureLog).where(PostureLog.chair_id == target.id)))
    sensor_rows = list(await db.scalars(select(SensorData).where(SensorData.chair_id == target.id)))
    return {"chairId": chair, "postureSamples": len(posture_rows), "status": target.status, "sensorCount": len(sensor_rows)}


@router.get("/reports/{period}")
async def report(period: str, chair: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    if period not in {"daily", "weekly", "monthly"}:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Unsupported report period")
    target = await chair_for(db, chair)
    rows = list(await db.scalars(select(SedentaryAnalysis).where(SedentaryAnalysis.chair_id == target.id).order_by(desc(SedentaryAnalysis.timestamp)).limit(1000)))
    return {"period": period, "chairId": chair, "entries": [SedentaryRead.model_validate(row) for row in rows]}
