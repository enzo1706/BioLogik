"""Auth service — handles registration, login, and token management."""

from logging import getLogger

from jose import JWTError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, UnauthorizedException
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

logger = getLogger(__name__)


class AuthService:
    """Business logic for authentication flows."""

    def __init__(self, db: Session) -> None:
        self.user_repo = UserRepository(db)

    def register(self, data: RegisterRequest) -> TokenResponse:
        """Register a new user and return JWT tokens."""
        existing = self.user_repo.get_by_email(data.email)
        if existing:
            raise ConflictException("A user with this email already exists")

        password_hash = hash_password(data.password)
        user = self.user_repo.create_with_password(data, password_hash)

        access_token = create_access_token(subject=str(user.id), role=user.role)
        refresh_token = create_refresh_token(subject=str(user.id))

        logger.info("User registered: %s (role=%s)", user.email, user.role)
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)

    def login(self, data: LoginRequest) -> TokenResponse:
        """Authenticate a user and return JWT tokens."""
        user = self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise UnauthorizedException("Invalid email or password")

        if not user.is_active:
            raise UnauthorizedException("Account is inactive")

        access_token = create_access_token(subject=str(user.id), role=user.role)
        refresh_token = create_refresh_token(subject=str(user.id))

        logger.info("User logged in: %s", user.email)
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)

    def refresh(self, refresh_token: str) -> TokenResponse:
        """Issue a new access token using a valid refresh token."""
        try:
            payload = decode_token(refresh_token)
        except JWTError:
            raise UnauthorizedException("Invalid or expired refresh token")

        if payload.get("type") != "refresh":
            raise UnauthorizedException("Token is not a refresh token")

        user_id = payload.get("sub")
        user = self.user_repo.get(user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive")

        new_access = create_access_token(subject=str(user.id), role=user.role)
        new_refresh = create_refresh_token(subject=str(user.id))

        return TokenResponse(access_token=new_access, refresh_token=new_refresh)
