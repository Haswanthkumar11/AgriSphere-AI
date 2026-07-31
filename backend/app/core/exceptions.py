"""
AgriSphere AI — Centralized error handling.

Rule: no `try/except` scattered through routers/services for turning errors
into HTTP responses. Services/repositories raise these domain exceptions;
FastAPI's exception handlers (registered in `register_exception_handlers`)
are the *only* place that converts them into the standard response envelope.
"""
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError

from .responses import error_response

logger = logging.getLogger("agrisphere")


class AppException(Exception):
    """Base class for all domain/business exceptions."""
    status_code = 400

    def __init__(self, message: str, status_code: int | None = None):
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        super().__init__(message)


class NotFoundException(AppException):
    status_code = 404


class ConflictException(AppException):
    status_code = 409


class UnauthorizedException(AppException):
    status_code = 401


class ForbiddenException(AppException):
    status_code = 403


class ValidationException(AppException):
    status_code = 422


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        logger.warning(f"{request.method} {request.url.path} -> {exc.status_code} {exc.message}")
        return error_response(exc.message, status_code=exc.status_code)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logger.warning(f"{request.method} {request.url.path} -> {exc.status_code} {exc.detail}")
        return error_response(str(exc.detail), status_code=exc.status_code)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"{request.method} {request.url.path} -> 422 validation error")
        return error_response("Validation failed", status_code=422, errors=exc.errors())

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception(f"Unhandled error on {request.method} {request.url.path}: {exc}")
        return error_response("Internal server error", status_code=500)
