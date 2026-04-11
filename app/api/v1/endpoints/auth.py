from datetime import datetime, timezone
import json
import secrets
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field

from app.core.auth import CurrentUser, create_bearer_token
from app.core.config import get_settings
from app.core.redis_client import redis_client
from app.utils.deps import get_current_user

router = APIRouter(prefix="/auth")
settings = get_settings()


class WebViewCodeCreateResponse(BaseModel):
    code: str
    expires_in: int
    url: str


class WebViewCodeExchangeRequest(BaseModel):
    code: str = Field(min_length=8)


class SessionRead(BaseModel):
    authenticated: bool
    tenant_id: str
    user_id: str
    role: Optional[str] = None
    is_admin: bool


def _webview_code_key(code: str) -> str:
    return f"webview_auth:{code}"


def _webview_code_used_key(code: str) -> str:
    return f"webview_auth_used:{code}"


def _serialize_webview_payload(user: CurrentUser) -> str:
    payload: Dict[str, Any] = {
        "tenant_id": user.tenant_id,
        "user_id": user.subject,
        "role": user.role,
        "is_admin": user.is_admin,
        "claims": user.claims,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    return json.dumps(payload)


def _deserialize_webview_payload(raw: str) -> Dict[str, Any]:
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webview auth payload",
        ) from exc
    return payload


@router.get("/session", response_model=SessionRead)
def read_session(user: CurrentUser = Depends(get_current_user)):
    return {
        "authenticated": True,
        "tenant_id": user.tenant_id,
        "user_id": user.subject,
        "role": user.role,
        "is_admin": user.is_admin,
    }


@router.post("/webview/create-code", response_model=WebViewCodeCreateResponse)
def create_webview_code(
    user: CurrentUser = Depends(get_current_user),
):
    code = secrets.token_urlsafe(24)
    redis_client.delete(_webview_code_used_key(code))
    redis_client.setex(
        _webview_code_key(code),
        settings.WEBVIEW_AUTH_CODE_TTL_SECONDS,
        _serialize_webview_payload(user),
    )

    exchange_url = (
        f"{settings.frontend_url}/webview-auth"
        f"?code={code}"
    )
    return {
        "code": code,
        "expires_in": settings.WEBVIEW_AUTH_CODE_TTL_SECONDS,
        "url": exchange_url,
    }


@router.post("/webview/exchange", response_model=SessionRead)
def exchange_webview_code(
    payload: WebViewCodeExchangeRequest,
    response: Response,
):
    key = _webview_code_key(payload.code)
    raw = redis_client.get(key)
    if not raw:
        used_marker = redis_client.get(_webview_code_used_key(payload.code))
        detail = (
            "This WebView sign-in link was already used. Please open a fresh link from the app."
            if used_marker
            else "This WebView sign-in link is invalid or expired. Please request a new one."
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )

    redis_client.delete(key)
    redis_client.setex(
        _webview_code_used_key(payload.code),
        settings.WEBVIEW_AUTH_CODE_TTL_SECONDS,
        "used",
    )
    data = _deserialize_webview_payload(raw)
    token = create_bearer_token(
        tenant_id=str(data["tenant_id"]),
        subject=str(data["user_id"]),
        is_admin=bool(data.get("is_admin")),
        extra_claims=data.get("claims") if isinstance(data.get("claims"), dict) else None,
    )

    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return {
        "authenticated": True,
        "tenant_id": str(data["tenant_id"]),
        "user_id": str(data["user_id"]),
        "role": data.get("role"),
        "is_admin": bool(data.get("is_admin")),
    }


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.delete_cookie(
        key=settings.SESSION_COOKIE_NAME,
        path="/",
        samesite=settings.SESSION_COOKIE_SAMESITE,
    )
    response.status_code = status.HTTP_204_NO_CONTENT
    return None
