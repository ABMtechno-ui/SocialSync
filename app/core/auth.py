from dataclasses import dataclass
import time
from typing import Any, Dict, Optional

import jwt
from fastapi import HTTPException, status

from app.core.config import get_settings


@dataclass
class CurrentUser:
    subject: str
    tenant_id: str
    role: Optional[str]
    is_admin: bool
    claims: Dict[str, Any]


def create_bearer_token(
    *,
    tenant_id: str,
    subject: str,
    is_admin: bool = False,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> str:
    settings = get_settings()
    if not settings.JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT signing key is not configured",
        )

    now = int(time.time())
    payload: Dict[str, Any] = {
        settings.JWT_TENANT_CLAIM: tenant_id,
        settings.JWT_SUBJECT_CLAIM: subject,
        settings.JWT_ROLE_CLAIM: bool(is_admin),
        "iat": now,
        "exp": now + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60),
    }

    if settings.JWT_ISSUER:
        payload["iss"] = settings.JWT_ISSUER
    if settings.JWT_AUDIENCE:
        payload["aud"] = settings.JWT_AUDIENCE
    if extra_claims:
        reserved_claims = {
            "exp",
            "iat",
            "iss",
            "aud",
            settings.JWT_TENANT_CLAIM,
            settings.JWT_SUBJECT_CLAIM,
            settings.JWT_ROLE_CLAIM,
        }
        payload.update(
            {
                key: value
                for key, value in extra_claims.items()
                if key not in reserved_claims
            }
        )

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_bearer_token(token: str) -> CurrentUser:
    settings = get_settings()

    algorithms = [settings.JWT_ALGORITHM]
    kwargs: Dict[str, Any] = {}

    if settings.JWT_AUDIENCE:
        kwargs["audience"] = settings.JWT_AUDIENCE
    else:
        kwargs["options"] = {"verify_aud": False}

    if settings.JWT_ISSUER:
        kwargs["issuer"] = settings.JWT_ISSUER

    key = settings.JWT_PUBLIC_KEY if settings.JWT_ALGORITHM.startswith("RS") else settings.JWT_SECRET
    if not key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT verification key is not configured",
        )

    try:
        claims = jwt.decode(token, key, algorithms=algorithms, **kwargs)
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid bearer token: {exc}",
        ) from exc

    tenant_id = claims.get(settings.JWT_TENANT_CLAIM)
    subject = claims.get(settings.JWT_SUBJECT_CLAIM)
    role_claim = claims.get(settings.JWT_ROLE_CLAIM)

    if not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"JWT claim '{settings.JWT_TENANT_CLAIM}' is missing",
        )

    if not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"JWT claim '{settings.JWT_SUBJECT_CLAIM}' is missing",
        )

    is_admin = str(role_claim).lower() == "true" if role_claim is not None else False
    resolved_role = "admin" if is_admin else "user"

    return CurrentUser(
        subject=str(subject),
        tenant_id=str(tenant_id),
        role=resolved_role,
        is_admin=is_admin,
        claims=claims,
    )
