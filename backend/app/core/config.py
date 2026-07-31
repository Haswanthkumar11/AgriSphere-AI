"""
AgriSphere AI — Centralized configuration.

Rule: nowhere else in the codebase should call os.getenv() directly.
Every setting is read once, here, and imported as `settings` everywhere else.
This is what makes secrets/config swaps (e.g. SQLite -> Postgres/Supabase,
or a new JWT secret in production) a one-file change.
"""
import os
from functools import lru_cache
from dotenv import load_dotenv

# Base directory setup & automatic .env file loading
BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH: str = os.path.join(BASE_DIR, ".env")
if os.path.exists(ENV_PATH):
    load_dotenv(ENV_PATH)


class Settings:
    # --- App ---
    APP_NAME: str = "AgriSphere AI API"
    APP_DESCRIPTION: str = "Autonomous Agricultural Ecosystem — backend gateway (hackathon build)"
    APP_VERSION: str = "1.0.0"
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = ENV != "production"

    # --- CORS ---
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "*").split(",")

    # --- Database ---
    BASE_DIR: str = BASE_DIR
    DEFAULT_DB_PATH: str = os.path.join(BASE_DIR, "agrisphere.db")
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

    # --- Auth ---
    JWT_SECRET: str = os.getenv("JWT_SECRET", "agrisphere-hackathon-demo-secret")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_DAYS: int = int(os.getenv("JWT_EXPIRY_DAYS", "7"))

    # --- Static / frontend ---
    STATIC_DIR: str = os.path.join(BASE_DIR, "static")
    FRONTEND_INDEX: str = os.path.join(BASE_DIR, "..", "frontend", "index.html")

    # --- Demo defaults (hackathon convenience, not for production) ---
    DEMO_FARMER_ID: str = "usr_demo"
    DEMO_REGION: str = "Tirupati, Andhra Pradesh"

    # --- AI & Audio Integrations ---
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    ASSEMBLYAI_API_KEY: str | None = os.getenv("ASSEMBLYAI_API_KEY")
    MURF_API_KEY: str | None = os.getenv("MURF_API_KEY")

    # --- Logging ---
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
