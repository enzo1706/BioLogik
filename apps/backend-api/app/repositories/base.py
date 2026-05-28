"""Base repository with generic CRUD operations."""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import Base

ModelT = TypeVar("ModelT", bound=Base)
CreateSchemaT = TypeVar("CreateSchemaT", bound=BaseModel)
UpdateSchemaT = TypeVar("UpdateSchemaT", bound=BaseModel)


class BaseRepository(Generic[ModelT]):
    """Generic repository providing common database operations.

    Type Parameters:
        ModelT: The SQLAlchemy model class.
    """

    def __init__(self, model: type[ModelT], db: Session) -> None:
        self.model = model
        self.db = db

    def get(self, id: Any) -> ModelT | None:
        """Retrieve a single record by its primary key."""
        return self.db.get(self.model, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[ModelT]:
        """Retrieve a paginated list of records."""
        stmt = select(self.model).offset(skip).limit(limit)
        return list(self.db.scalars(stmt).all())

    def create(self, data: CreateSchemaT) -> ModelT:
        """Create a new record from a Pydantic schema."""
        instance = self.model(**data.model_dump())
        self.db.add(instance)
        self.db.flush()
        self.db.refresh(instance)
        return instance

    def update(self, id: Any, data: UpdateSchemaT) -> ModelT | None:
        """Update a record with partial data from a Pydantic schema."""
        instance = self.get(id)
        if not instance:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(instance, key, value)
        self.db.flush()
        self.db.refresh(instance)
        return instance

    def delete(self, id: Any) -> bool:
        """Delete a record by its primary key. Returns True if deleted."""
        instance = self.get(id)
        if not instance:
            return False
        self.db.delete(instance)
        self.db.flush()
        return True

    def count(self) -> int:
        """Return the total number of records."""
        stmt = select(self.model)
        return self.db.scalar(select(self.model).with_only_columns(self.model.id.count()))  # type: ignore[attr-defined]
