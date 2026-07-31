"""
AgriSphere AI — Request logging middleware.

Logs every request (method, path, status, duration). Domain-specific events
(login, upload, booking, AI prediction) are logged separately inside the
relevant service, per the "Every AI prediction / Every login / Every upload /
Every booking should be logged" rule.
"""
import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("agrisphere.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = round((time.perf_counter() - start) * 1000, 1)
        logger.info(f"{request.method} {request.url.path} -> {response.status_code} ({duration_ms}ms)")
        return response
