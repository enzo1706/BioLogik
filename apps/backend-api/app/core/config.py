"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables.

    Values are read from a ``.env`` file (if present) and from the environment.
    """

    # ── General ──────────────────────────────────────────────
    app_name: str = "BioLogik API"
    app_version: str = "0.1.0"
    debug: bool = False
    environment: str = "development"  # development | staging | production

    # ── Database ─────────────────────────────────────────────
    database_url: str = "postgresql://postgres:postgres@localhost:5432/biologik"

    # ── JWT Auth ─────────────────────────────────────────────
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_minutes: int = 10080  # 7 days

    # ── CORS ─────────────────────────────────────────────────
    cors_origins: list[str] = [
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
    ]

    # ── Security ─────────────────────────────────────────────
    password_min_length: int = 8
    bcrypt_rounds: int = 12

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")


settings = Settings()
