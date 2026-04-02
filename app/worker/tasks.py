from app.worker.celery_app import celery_app
from app.services.publisher import publish_post

@celery_app.task
def publish_post_task(post_id, tenant_id):
    publish_post(post_id, tenant_id)