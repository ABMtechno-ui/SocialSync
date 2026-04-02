from sqlalchemy.orm import declarative_base

Base = declarative_base()

from app.models.social_account import SocialAccount
from app.models.scheduled_post import ScheduledPost
from app.models.media_asset import MediaAsset
from app.models.post_media import PostMedia
