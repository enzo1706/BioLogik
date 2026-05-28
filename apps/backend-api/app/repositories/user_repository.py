"""User repository — extends BaseRepository with user-specific queries."""

from sqlalchemy import select

from app.models.user import User
from app.repositories.base import BaseRepository
from app.schemas.user import UserCreate


class UserRepository(BaseRepository[User]):
    """Data-access layer for the User model."""

    def __init__(self, db) -> None:
        super().__init__(model=User, db=db)

    def get_by_email(self, email: str) -> User | None:
        """Find a user by their email address."""
        stmt = select(User).where(User.email == email)
        return self.db.scalar(stmt)

    def get_by_role(self, role: str, skip: int = 0, limit: int = 100) -> list[User]:
        """Retrieve users filtered by role."""
        stmt = select(User).where(User.role == role).offset(skip).limit(limit)
        return list(self.db.scalars(stmt).all())

    def create_with_password(self, data: UserCreate, password_hash: str) -> User:
        """Create a new user with a pre-hashed password."""
        user = User(
            name=data.name,
            email=data.email,
            password_hash=password_hash,
            role="customer",
            is_active=True,
        )
        self.db.add(user)
        self.db.flush()
        self.db.refresh(user)
        return user
