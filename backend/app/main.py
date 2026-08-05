from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.database import Base, engine
from app.api.v1.auth import router as auth_router
from app.api.v1.reports import router as reports_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[    
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(reports_router)

# Serve uploaded report images 
uploads_root = Path(__file__).resolve().parent.parent / "uploads"
uploads_root.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_root)), name="uploads")


@app.get("/")
def root():
    return {
        "message": f"{settings.APP_NAME} API"
    }
