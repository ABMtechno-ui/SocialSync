from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

class PostCreate(BaseModel):
    social_account_id: int
    content: Optional[str]
    platform_options: Optional[Dict] = {}
    scheduled_at: Optional[datetime] = None
    media_ids: Optional[List[int]] = []