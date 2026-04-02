from app.db.database import SessionLocal
from app.models.scheduled_post import ScheduledPost
from datetime import datetime
import time

def publish_post(post_id: int, tenant_id: str):
    db = SessionLocal()

    post = db.query(ScheduledPost).filter_by(
        id=post_id,
        tenant_id=tenant_id
    ).first()

    if not post:
        return

    try:
        post.status = "processing"
        db.commit()

        # simulate API call
        time.sleep(3)

        post.status = "success"
        post.posted_at = datetime.utcnow()
        post.platform_post_id = "demo_123"

    except Exception as e:
        post.retry_count += 1
        post.error_message = str(e)

        if post.retry_count >= post.max_retries:
            post.status = "failed"
        else:
            post.status = "pending"

    db.commit()
    db.close()