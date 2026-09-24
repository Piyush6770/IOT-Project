import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import create_access_token, get_current_user, hash_password, verify_password
from app.database.session import get_db
from app.models import User
from app.schemas.auth import RegisterRequest, TokenResponse, UserRead

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    if await db.scalar(select(User).where(User.email == request.email.lower())):
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(name=request.name, email=request.email.lower(), password_hash=hash_password(request.password), role="User", age=request.age, height=request.height, weight=request.weight)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    logger.info("User registered email=%s", user.email)
    return TokenResponse(access_token=create_access_token(user.id), user=user)


@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await db.scalar(select(User).where(User.email == form_data.username.lower()))
    if user is None or not verify_password(form_data.password, user.password_hash):
        logger.warning("Failed login email=%s", form_data.username)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(access_token=create_access_token(user.id), user=user)


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
