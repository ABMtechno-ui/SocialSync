# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # Security
    ENCRYPTION_KEY: str

    # OAuth
    FACEBOOK_CLIENT_ID: str
    FACEBOOK_SECRET: str
    LINKEDIN_CLIENT_ID: str
    LINKEDIN_SECRET: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_SECRET: str

    # Cloudinary (for media uploads)
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # Twitter OAuth
    TWITTER_CLIENT_ID: str
    TWITTER_CLIENT_SECRET: str
    TWITTER_REDIRECT_URI: str = "http://127.0.0.1:8000/api/v1/oauth/twitter/callback"

    FACEBOOK_REDIRECT_URI: str = "http://127.0.0.1:8000/api/v1/oauth/facebook/callback"
    LINKEDIN_REDIRECT_URI: str = "http://127.0.0.1:8000/api/v1/oauth/linkedin/callback"
    GOOGLE_REDIRECT_URI: str = "http://127.0.0.1:8000/api/v1/oauth/google/callback"


    # Application
    PROJECT_NAME: str = "SocialSync"
    API_V1_STR: str = "/api/v1"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()