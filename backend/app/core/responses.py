"""
AgriSphere AI — Standard API response envelope.

Every endpoint returns the same shape:

    {
        "success": true,
        "message": "...",
        "data": {...} | [...] | null,
        "timestamp": "...",
        "errors": null | {...}
    }

Routers call `success_response(...)`; the global exception handlers
(core/exceptions.py) build `error_response(...)` for failures. Nothing else
in the codebase should hand-roll a response dict.
"""
import datetime
from typing import Any
from fastapi.responses import JSONResponse


def _now() -> str:
    return datetime.datetime.utcnow().isoformat() + "Z"


def success_response(data: Any = None, message: str = "OK", status_code: int = 200) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data,
            "timestamp": _now(),
            "errors": None,
        },
    )


def error_response(message: str, status_code: int = 400, errors: Any = None) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": None,
            "timestamp": _now(),
            "errors": errors,
        },
    )
