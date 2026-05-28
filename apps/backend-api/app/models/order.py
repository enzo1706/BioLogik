"""Order model."""

import uuid
from decimal import Decimal

from sqlalchemy import Enum, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class Order(TimestampMixin, Base):
    """A customer order containing multiple meal items."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(
        Enum("pending", "preparing", "completed", "delivered", name="order_status"),
        nullable=False,
        default="pending",
    )
    total: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # ── Relationships ────────────────────────────────────────
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", lazy="selectin", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Order id={self.id} status={self.status} total={self.total}>"


class OrderItem(TimestampMixin, Base):
    """Individual line item within an order."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False
    )
    meal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("meals.id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(nullable=False, default=1)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)

    # ── Relationships ────────────────────────────────────────
    order = relationship("Order", back_populates="items")
    meal = relationship("Meal", lazy="selectin")

    def __repr__(self) -> str:
        return f"<OrderItem id={self.id} meal={self.meal_id} qty={self.quantity}>"
