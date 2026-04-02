from sqlalchemy import Column, Integer, String, Text, Boolean, TIMESTAMP
from datetime import datetime
from app.db.base import Base

class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(String(100), nullable=False, index=True)
    platform = Column(String(50), nullable=False)
    account_type = Column(String(50))
    platform_account_id = Column(String(255), nullable=False)
    account_name = Column(String(255), nullable=False)
    profile_picture_url = Column(Text)

    encrypted_token = Column(Text, nullable=False)
    encrypted_refresh_token = Column(Text)
    token_expiry = Column(TIMESTAMP(timezone=True))

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)