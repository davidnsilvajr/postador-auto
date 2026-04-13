from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class BrandCreate(BaseModel):
    name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    tone_of_voice: Optional[str] = None  # e.g., "formal", "casual", "humorous"


class BrandGuideline(BaseModel):
    brand_id: UUID
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    font_family: Optional[str] = None
    tagline: Optional[str] = None
    keywords: Optional[list[str]] = None
    brand_voice_description: Optional[str] = None
    do_not_say: Optional[list[str]] = None
    must_include: Optional[list[str]] = None
    logo_url: Optional[str] = None
    logo_variants: Optional[list[str]] = None  # light, dark, square, etc.


class BrandResponse(BaseModel):
    id: UUID
    name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    tone_of_voice: Optional[str] = None
    guideline: Optional[BrandGuideline] = None
    social_accounts: Optional[list[dict]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
