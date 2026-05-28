"""Appointment model — nutritionist-patient meetings."""

import uuid

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class Appointment(TimestampMixin, Base):
    """A scheduled appointment between a nutritionist and a patient."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    nutritionist_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # ── Relationships ────────────────────────────────────────
    nutritionist = relationship(
        "User", foreign_keys=[nutritionist_id], back_populates="appointments_as_nutritionist"
    )
    patient = relationship(
        "User", foreign_keys=[patient_id], back_populates="appointments_as_patient"
    )

    def __repr__(self) -> str:
        return f"<Appointment id={self.id} nutritionist={self.nutritionist_id} patient={self.patient_id}>"
