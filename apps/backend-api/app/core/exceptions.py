"""Custom exception classes and global exception handlers for FastAPI."""

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Base application exception."""

    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(AppException):
    """Raised when a resource is not found."""

    def __init__(self, detail: str = "Resource not found") -> None:
        super().__init__(message=detail, status_code=404)


class UnauthorizedException(AppException):
    """Raised when authentication fails."""

    def __init__(self, detail: str = "Not authenticated") -> None:
        super().__init__(message=detail, status_code=401)


class ForbiddenException(AppException):
    """Raised when the user lacks permissions."""

    def __init__(self, detail: str = "Forbidden") -> None:
        super().__init__(message=detail, status_code=403)


class ConflictException(AppException):
    """Raised on resource conflicts (e.g. duplicate email)."""

    def __init__(self, detail: str = "Conflict") -> None:
        super().__init__(message=detail, status_code=409)


class ValidationException(AppException):
    """Raised for business-rule validation failures."""

    def __init__(self, detail: str = "Validation error") -> None:
        super().__init__(message=detail, status_code=422)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Global handler for AppException subclasses."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Global handler for FastAPI HTTPException."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all for unhandled exceptions (500)."""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
