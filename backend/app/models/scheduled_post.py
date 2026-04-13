from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class ScheduledPostCreate(BaseModel):
    post_id: UUID
    platform: str
    scheduled_at: datetime
    timezone: str = "America/Sao_Paulo"


class ScheduledPostResponse(BaseModel):
    id: UUID
    post_id: UUID
    platform: str
    scheduled_at: datetime
    timezone: str
    status: str
    published_at: Optional[datetime] = None
    external_post_id: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
