from fastapi import APIRouter
from app.api.v1 import auth, data_routes, frontend_compat_routes

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(data_routes.router)
api_router.include_router(frontend_compat_routes.router)
