"""FastAPI dependency injection — database sessions, auth, role checking."""

from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token

# ── Bearer token scheme for OpenAPI docs ─────────────────────
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> str:
    """Extract and validate the current user's ID from the JWT access token.

    Returns:
        The user id (UUID string) embedded in the token's ``sub`` claim.

    Raises:
        HTTPException 401: If the token is missing, expired, or invalid.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        payload = decode_token(credentials.credentials)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )

    return user_id


def get_current_user_role(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> str:
    """Extract the current user's role from the JWT access token.

    Returns:
        The role string (e.g. ``"customer"``, ``"admin"``).

    Raises:
        HTTPException 401: If the token is missing, expired, or invalid.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        payload = decode_token(credentials.credentials)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    return payload.get("role", "")


class RoleChecker:
    """Dependency class that ensures the authenticated user has one of the allowed roles.

    Usage::

        @router.get("/admin-only", dependencies=[Depends(RoleChecker("admin"))])
        async def admin_endpoint():
            ...

        @router.get("/staff", dependencies=[Depends(RoleChecker("admin", "kitchen"))])
        async def staff_endpoint():
            ...
    """

    def __init__(self, *allowed_roles: str) -> None:
        self.allowed_roles = allowed_roles

    def __call__(self, role: str = Depends(get_current_user_role)) -> str:
        if role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return role
