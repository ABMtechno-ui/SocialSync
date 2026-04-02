from fastapi import APIRouter

from app.services.platform_registry import get_platform_capabilities

router = APIRouter()


@router.get("/")
def list_platform_capabilities():
    return {
        "platforms": get_platform_capabilities()
    }
