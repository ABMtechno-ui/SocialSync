from typing import Optional

from sqlalchemy.orm import Session

from app.models.media_asset import MediaAsset
from app.schemas.media import MediaUpdate


def create_media_asset(
    db: Session,
    tenant_id: str,
    file_url: str,
    file_type: str,
    mime_type: Optional[str] = None,
    file_size_bytes: Optional[int] = None,
    width_px: Optional[int] = None,
    height_px: Optional[int] = None,
    duration_seconds: Optional[int] = None,
    alt_text: Optional[str] = None,
):
    media = MediaAsset(
        tenant_id=tenant_id,
        file_url=file_url,
        file_type=file_type,
        mime_type=mime_type,
        file_size_bytes=file_size_bytes,
        width_px=width_px,
        height_px=height_px,
        duration_seconds=duration_seconds,
        alt_text=alt_text,
    )
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


def list_media_assets(db: Session, tenant_id: str):
    return (
        db.query(MediaAsset)
        .filter(MediaAsset.tenant_id == tenant_id)
        .order_by(MediaAsset.id.desc())
        .all()
    )


def get_media_asset(db: Session, tenant_id: str, media_id: int):
    return (
        db.query(MediaAsset)
        .filter(
            MediaAsset.id == media_id,
            MediaAsset.tenant_id == tenant_id,
        )
        .first()
    )


def update_media_asset(db: Session, tenant_id: str, media_id: int, data: MediaUpdate):
    media = get_media_asset(db, tenant_id, media_id)
    if not media:
        return None

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(media, field, value)

    db.commit()
    db.refresh(media)
    return media
