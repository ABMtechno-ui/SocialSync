from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import get_settings
from app.db.database import engine
from app.db.base import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    print(f"Starting {settings.PROJECT_NAME}")

    # Create tables (only for development)
    Base.metadata.create_all(bind=engine)

    yield

    print("Shutting down application")


app = FastAPI(
    title=get_settings().PROJECT_NAME,
    description="Multi-platform Social Media Scheduler",
    version="1.0.0",
    lifespan=lifespan,
    openapi_url=f"{get_settings().API_V1_STR}/openapi.json"
)

from app.api.v1.api import api_router
app.include_router(api_router, prefix=get_settings().API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "Welcome to SocialSync API",
        "docs": "/docs"
    }
