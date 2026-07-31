"""Shared short-ID generator used by every model's default primary key."""
import uuid


def gen_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}"
