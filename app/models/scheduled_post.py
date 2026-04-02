from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import Base
from datetime import datetime

class ScheduledPost(Base):
    __tablename__ = "scheduled_posts"

    id = Column(Integer, primary_key=True, index=True)

    social_account_id = Column(
        Integer,
        ForeignKey("social_accounts.id", ondelete="CASCADE"),
        nullable=False
    )

    tenant_id = Column(String(100), nullable=False, index=True)
    platform = Column(String(50), nullable=False)

    content = Column(Text)

    platform_options = Column(JSONB, default=dict, nullable=False)

    scheduled_at = Column(TIMESTAMP(timezone=True))
    posted_at = Column(TIMESTAMP(timezone=True))

    status = Column(String(20), default="pending", nullable=False)

    retry_count = Column(Integer, default=0, nullable=False)
    max_retries = Column(Integer, default=3, nullable=False)

    error_message = Column(Text)
    platform_post_id = Column(String(255))

    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)