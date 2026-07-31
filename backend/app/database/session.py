"""
AgriSphere AI — Database session management.

Engine/session creation and the `get_db` FastAPI dependency live here only.
Routers never touch this file directly — they receive a `Session` via
`Depends(get_db)` and pass it straight into a service, per the Dependency
Injection + Repository Pattern rules.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..core.config import settings
from .base import Base

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all tables and seed demo data. Called once on app startup."""
    # Import models so they register on Base.metadata before create_all runs.
    from .. import models  # noqa: F401
    from .seed import seed_demo_data

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_demo_data(db)
    finally:
        db.close()
