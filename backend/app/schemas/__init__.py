from pydantic import BaseModel
from typing import Optional
from enum import Enum


class AIContentRequest(BaseModel):
    """Request for AI content generation"""
    brand_id: str
    campaign: Optional[str] = None
    topic: str
    tone: Optional[str] = None
    platforms: list[str] = ["instagram", "facebook", "twitter", "linkedin"]
    language: str = "pt-BR"
    generate_image: bool = True
    image_prompt: Optional[str] = None


class AIGeneratedContent(BaseModel):
    """Response from AI content generation"""
    captions: dict[str, str] = {}  # caption per platform: {"instagram": "...", ...}
    caption: Optional[str] = None  # convenience: primary caption (instagram by default)
    hashtags: list[str] = []
    image_prompt: Optional[str] = None
    image_url: Optional[str] = None
    image_error: Optional[str] = None  # set if image generation failed (content still returned)
    variations: list[str] = []  # alternative caption versions
    best_posting_times: list[str] = []
    content_pillars: list[str] = []


class ApprovalRequest(BaseModel):
    """Approve or reject a post"""
    action: str  # "approve" | "reject"
    feedback: Optional[str] = None  # feedback if rejected


class SocialAccountConnect(BaseModel):
    """Connect a social media account"""
    platform: str
    access_token: Optional[str] = None
    page_id: Optional[str] = None  # for Facebook/Instagram


class MediaUploadResponse(BaseModel):
    url: str
    filename: str
    size: int
    content_type: str


class CalendarDay(BaseModel):
    date: str
    posts: list[dict]
    scheduled_count: int
    published_count: int


class AnalyticsSummary(BaseModel):
    total_posts: int = 0
    total_impressions: int = 0
    total_engagement: int = 0
    avg_engagement_rate: float = 0.0
    top_platform: str = ""
    top_post: Optional[dict] = None
    date_range: dict = {}


class TrendingTopic(BaseModel):
    topic: str
    category: str
    volume: int  # search volume / mentions
    trend_score: float  # 0-100

    class Config:
        protected_namespaces = ()
