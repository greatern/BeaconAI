"""
Centralized application settings.

Everything that used to be read via scattered os.getenv() calls
(database.py, security.py) is consolidated here so there's a single
source of truth, validation on startup, and sane defaults for local dev.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- App ---
    APP_NAME: str = "Beacon AI"
    ENV: str = "development"

    # --- Database ---
    DATABASE_URL: str

    # --- Auth ---
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60

    # --- File storage (reports) ---
    # Local disk for now; swap to S3-backed storage later without
    # touching any calling code, since routes only ever import `settings`.
    UPLOAD_DIR: str = "uploads/reports"
    MAX_UPLOAD_MB: int = 8
    ALLOWED_IMAGE_TYPES: set[str] = {"image/jpeg", "image/png", "image/webp"}


settings = Settings()
