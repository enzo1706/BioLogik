"""Subscription model."""

import uuid

from sqlalchemy import Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class Subscription(TimestampMixin, Base):
    """A user's subscription to a meal plan."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    plan: Mapped[str] = mapped_column(
        Enum("weekly", "monthly", name="subscription_plan"), nullable=False
    )
    status: Mapped[str] = mapped_column(
        Enum("active", "paused", "cancelled", name="subscription_status"),
        nullable=False,
        default="active",
    )

    # ── Relationships ────────────────────────────────────────
    user = relationship("User", back_populates="subscriptions")

    def __repr__(self) -> str:
        return f"<Subscription id={self.id} plan={self.plan} status={self.status}>"
