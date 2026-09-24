from datetime import datetime
from pydantic import EmailStr, Field
from app.schemas.common import ORMModel


class RegisterRequest(ORMModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    age: int | None = Field(default=None, ge=13, le=120)
    height: float | None = Field(default=None, gt=0, le=300)
    weight: float | None = Field(default=None, gt=0, le=500)
    role: str = Field(default="User", pattern="^(User|Admin)$")


class UserRead(ORMModel):
    id: int
    name: str
    email: EmailStr
    role: str
    age: int | None
    height: float | None
    weight: float | None
    created_at: datetime


class TokenResponse(ORMModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
