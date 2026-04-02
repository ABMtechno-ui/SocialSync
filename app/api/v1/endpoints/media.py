from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.crud.media import get_media_asset, list_media_assets, update_media_asset
from app.schemas.media import MediaRead, MediaUpdate, MediaUploadResponse
from app.services.media_service import create_media_from_upload, delete_media_asset_and_file
from app.utils.deps import get_db, get_tenant

router = APIRouter()


@router.post("/upload", response_model=MediaUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_media(
    file: UploadFile = File(...),
    alt_text: Optional[str] = Form(default=None),
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    return create_media_from_upload(db, tenant_id, file, alt_text)


@router.get("/", response_model=list[MediaRead])
def list_media(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    return list_media_assets(db, tenant_id)


@router.get("/{media_id}", response_model=MediaRead)
def get_media(
    media_id: int,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    media = get_media_asset(db, tenant_id, media_id)
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )
    return media


@router.patch("/{media_id}", response_model=MediaRead)
def update_media(
    media_id: int,
    data: MediaUpdate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    media = update_media_asset(db, tenant_id, media_id, data)
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )
    return media


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    deleted = delete_media_asset_and_file(db, tenant_id, media_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )
    return None
