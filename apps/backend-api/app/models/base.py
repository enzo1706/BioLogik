"""Declarative Base and common mixins for all models."""

from datetime import UTC, datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, declared_attr, mapped_column

from app.core.database import Base  # noqa: F401 — re-export for convenience


class TimestampMixin:
    """Mixin that adds created_at / updated_at timestamp columns."""

    @declared_attr
    def __tablename__(cls) -> str:  # type: ignore[misc]
        """Auto-generate table name from class name (snake_case)."""
        import re

        name = re.sub(r"(?<!^)(?=[A-Z])", "_", cls.__name__).lower()  # type: ignore[arg-type]
        # Pluralise common endings
        if name.endswith("y"):
            name = name[:-1] + "ies"
        elif not name.endswith("s"):
            name += "s"
        return name

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
