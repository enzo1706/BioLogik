"""Auth-related Pydantic schemas."""

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Login credentials."""

    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """User registration payload."""

    name: str
    email: EmailStr
    password: str
    # role defaults to "customer" on the backend side


class TokenResponse(BaseModel):
    """JWT token pair returned on successful auth."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    """Request body for token refresh."""

    refresh_token: str


class TokenPayload(BaseModel):
    """Decoded JWT payload (used internally)."""

    sub: str  # user id
    role: str
    exp: int
    type: str  # "access" | "refresh"
