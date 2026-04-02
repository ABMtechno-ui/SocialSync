# app/utils/deps.py
from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.core.config import get_settings
from typing import Generator

settings = get_settings()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_tenant(x_tenant_id: str = Header(None)) -> str:
    """
    Get tenant from header (X-Tenant-ID)
    Fallback for development
    """
    if x_tenant_id:
        return x_tenant_id
    # TODO: Replace this with proper JWT tenant extraction later
    return "tenant_123"


# Optional: Current user dependency (for future JWT)
def get_current_user():
    # Will implement JWT later
    pass