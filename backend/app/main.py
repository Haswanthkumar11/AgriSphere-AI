import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .core.config import settings
from .core.logging_config import configure_logging
from .core.exceptions import register_exception_handlers
from .middleware.logging_middleware import RequestLoggingMiddleware
from .database.session import init_db
from .api import auth, disease, quality, advisory, market, rentals, crop, harvest, resource

configure_logging()

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
)

# --- Production & Development CORS Configuration ---
default_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://agri-sphere-5dfze24ke-haswanth1.vercel.app",
]

env_origins = [o.strip() for o in settings.CORS_ORIGINS if o.strip() and o.strip() != "*"]
allowed_origins = list(dict.fromkeys(default_origins + env_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware)

register_exception_handlers(app)

os.makedirs(settings.STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

app.include_router(auth.router)
app.include_router(disease.router)
app.include_router(quality.router)
app.include_router(advisory.router)
app.include_router(market.router)
app.include_router(rentals.router)
app.include_router(crop.router)
app.include_router(harvest.router)
app.include_router(resource.router)


@app.on_event("startup")
def on_startup():
    init_db()


MODULES = [
    "Module 1: /api/v1/prices, /api/v1/weather, /api/v1/yield/predict",
    "Module 2: /api/v1/weather/current, /api/v1/weather/forecast, /api/v1/weather/alerts",
    "Module 3: /api/v1/crop/scan, /api/v1/crop/history, /api/v1/crop/compare, /api/v1/crop/knowledge-base",
    "Module 4: /api/v1/harvest/analyze, /api/v1/harvest/history, /api/v1/harvest/passport/{id}, /api/v1/harvest/storage/{id}, /api/v1/harvest/market/{id}",
    "Module 5: /api/v1/resources/equipment, /api/v1/resources/book, /api/v1/resources/bookings, /api/v1/resources/owner/requests, /api/v1/resources/notifications",
]


@app.get("/")
def root():
    if os.path.exists(settings.FRONTEND_INDEX):
        return FileResponse(settings.FRONTEND_INDEX)
    return {"service": settings.APP_NAME, "status": "running", "docs": "/docs", "modules": MODULES}


@app.get("/api")
def api_info():
    return {"service": settings.APP_NAME, "status": "running", "docs": "/docs", "modules": MODULES}


@app.get("/health")
def health():
    return {"status": "ok"}
