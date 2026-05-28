"""Common/shared Pydantic schemas."""

from pydantic import BaseModel


class Message(BaseModel):
    """Generic message response."""

    message: str


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str


class Pagination(BaseModel):
    """Pagination metadata."""

    page: int = 1
    per_page: int = 20
    total: int = 0


class PaginatedResponse(BaseModel):
    """Generic paginated response wrapper."""

    data: list
    pagination: Pagination
