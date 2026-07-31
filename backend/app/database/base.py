"""Shared SQLAlchemy declarative base — every model in models/ imports this."""
from sqlalchemy.orm import declarative_base

Base = declarative_base()
