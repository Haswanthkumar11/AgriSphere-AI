"""
AgriSphere AI — Logging setup.

Called once from main.py at startup. Every module logs through
`logging.getLogger("agrisphere")` (or a child logger of it) instead of
print() so log level/format stays consistent everywhere.
"""
import logging
from .config import settings


def configure_logging() -> None:
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    )
