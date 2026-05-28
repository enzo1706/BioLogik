"""User service — profile management business logic."""

from logging import getLogger

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse, UserUpdate

logger = getLogger(__name__)


class UserService:
    """Business logic for user profile operations."""

    def __init__(self, db: Session) -> None:
        self.user_repo = UserRepository(db)

    def get_profile(self, user_id: str) -> UserResponse:
        """Retrieve a user's public profile."""
        user = self.user_repo.get(user_id)
        if not user:
            raise NotFoundException("User not found")
        return UserResponse.model_validate(user)

    def update_profile(self, user_id: str, data: UserUpdate) -> UserResponse:
        """Update a user's profile information."""
        user = self.user_repo.update(user_id, data)
        if not user:
            raise NotFoundException("User not found")
        logger.info("User profile updated: %s", user.email)
        return UserResponse.model_validate(user)
