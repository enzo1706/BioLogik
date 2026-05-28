"""Health check endpoint — liveness probe."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """Basic liveness probe. Returns OK when the service is running."""
    return {"status": "ok", "version": "0.1.0"}
