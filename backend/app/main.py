from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.database import Base, engine
from app.api.v1.auth import router as auth_router
from app.api.v1.reports import router as reports_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)

app.include_router(auth_router)
app.include_router(reports_router)

# Serve uploaded report images (e.g. /uploads/reports/<file>.jpg)
uploads_root = Path(__file__).resolve().parent.parent / "uploads"
uploads_root.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_root)), name="uploads")


@app.get("/")
def root():
    return {
        "message": f"{settings.APP_NAME} API"
    }
