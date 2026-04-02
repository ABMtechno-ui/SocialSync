from fastapi import APIRouter
from sqlalchemy import text

from app.core.config import get_settings
from app.db.database import SessionLocal

router = APIRouter()

settings = get_settings()


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
    }


@router.get("/ready")
def readiness_check():
    db_ok = False
    redis_ok = False

    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False
    finally:
        db.close()

    try:
        import redis

        client = redis.from_url(settings.REDIS_URL)
        redis_ok = bool(client.ping())
    except Exception:
        redis_ok = False

    overall_status = "ready" if db_ok and redis_ok else "not_ready"

    return {
        "status": overall_status,
        "database": db_ok,
        "redis": redis_ok,
    }
