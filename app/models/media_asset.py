from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from app.db.base import Base
from datetime import datetime

class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(String(100), nullable=False, index=True)

    file_url = Column(Text, nullable=False)
    file_type = Column(String(20), nullable=False)
    mime_type = Column(String(100))

    file_size_bytes = Column(Integer)
    width_px = Column(Integer)
    height_px = Column(Integer)
    duration_seconds = Column(Integer)

    alt_text = Column(String(500))

    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)