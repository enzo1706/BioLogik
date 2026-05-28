"""Pytest fixtures for the BioLogik API test suite."""

from collections.abc import Generator
from typing import Any

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.api.v1.router import v1_router
from app.core.database import Base, get_db
from app.core.config import settings

# ── Test database ────────────────────────────────────────────
# Use SQLite for fast, isolated unit tests
TEST_DATABASE_URL = "sqlite:///./test_biologik.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db() -> Generator[Session, Any, None]:
    """Override the ``get_db`` dependency with a test database session."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def setup_database() -> Generator[None, Any, None]:
    """Create all tables once per test session, then drop them."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session() -> Generator[Session, Any, None]:
    """Provide a clean database session per test function."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def app() -> FastAPI:
    """Return a FastAPI application with overridden dependencies."""
    application = FastAPI()
    application.dependency_overrides[get_db] = override_get_db
    application.include_router(v1_router)
    return application


@pytest.fixture()
def client(app: FastAPI) -> TestClient:
    """Provide a TestClient bound to the test application."""
    return TestClient(app)
