from fastapi import FastAPI
from fastapi import FastAPI

from app.db.database import Base, engine
from app.api.v1.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Beacon AI")

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Beacon AI API"
    }