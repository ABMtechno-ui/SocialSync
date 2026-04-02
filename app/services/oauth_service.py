import requests
from datetime import datetime, timedelta
from app.core.security import encrypt_token
from app.models.social_account import SocialAccount
from app.db.database import SessionLocal


def save_social_account(
    tenant_id,
    platform,
    platform_account_id,
    account_name,
    access_token,
    refresh_token=None,
    expires_in=None
):
    db = SessionLocal()

    encrypted_access = encrypt_token(access_token)
    encrypted_refresh = encrypt_token(refresh_token) if refresh_token else None

    expiry = None
    if expires_in:
        expiry = datetime.utcnow() + timedelta(seconds=expires_in)

    account = SocialAccount(
        tenant_id=tenant_id,
        platform=platform,
        platform_account_id=platform_account_id,
        account_name=account_name,
        encrypted_token=encrypted_access,
        encrypted_refresh_token=encrypted_refresh,
        token_expiry=expiry
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return account