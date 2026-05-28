"""V1 API router — aggregates all v1 endpoint modules."""

from fastapi import APIRouter

from app.api.v1 import auth, health

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(auth.router)
v1_router.include_router(health.router)
