from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from uuid import UUID


class PostStatus(str, Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"
    REJECTED = "rejected"


class PostPlatform(str, Enum):
    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    TIKTOK = "tiktok"
    YOUTUBE = "youtube"


class Media(BaseModel):
    type: str  # image, video, carousel
    url: str
    alt_text: Optional[str] = None


class PostCreate(BaseModel):
    brand_id: UUID
    caption: str
    platforms: list[PostPlatform]
    media: Optional[list[Media]] = None
    hashtags: Optional[list[str]] = None
    scheduled_at: Optional[datetime] = None
    status: PostStatus = PostStatus.DRAFT
    campaign: Optional[str] = None
    notes: Optional[str] = None


class PostResponse(BaseModel):
    id: UUID
    brand_id: UUID
    caption: str
    platforms: list[str]
    media: Optional[list[dict]] = None
    hashtags: Optional[list[str]] = None
    scheduled_at: Optional[datetime] = None
    status: PostStatus
    campaign: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True
