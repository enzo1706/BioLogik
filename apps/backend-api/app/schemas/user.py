"""User-related Pydantic schemas."""

import uuid

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Shared user fields."""

    name: str
    email: EmailStr


class UserCreate(UserBase):
    """Payload for creating a new user."""

    password: str


class UserUpdate(BaseModel):
    """Payload for updating user profile (all fields optional)."""

    name: str | None = None
    email: EmailStr | None = None


class UserResponse(UserBase):
    """Public user representation returned by the API."""

    id: uuid.UUID
    role: str
    is_active: bool

    model_config = {"from_attributes": True}


class UserInDB(UserResponse):
    """Internal user representation (includes hashed password)."""

    password_hash: str
