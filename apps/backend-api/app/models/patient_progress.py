"""PatientProgress model — physical metrics tracking."""

import uuid

from sqlalchemy import Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class PatientProgress(TimestampMixin, Base):
    """Physical metrics record for a patient."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    weight: Mapped[float | None] = mapped_column(Float, nullable=True)
    body_fat: Mapped[float | None] = mapped_column(Float, nullable=True)
    muscle_mass: Mapped[float | None] = mapped_column(Float, nullable=True)

    # ── Relationships ────────────────────────────────────────
    user = relationship("User", back_populates="progress_entries")

    def __repr__(self) -> str:
        return f"<PatientProgress id={self.id} user={self.user_id}>"
