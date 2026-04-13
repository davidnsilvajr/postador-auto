from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AnalyticsResponse(BaseModel):
    post_id: str
    platform: str
    likes: int = 0
    comments: int = 0
    shares: int = 0
    impressions: int = 0
    reach: int = 0
    engagement_rate: float = 0.0
    clicks: int = 0
    saves: int = 0
    collected_at: Optional[datetime] = None
