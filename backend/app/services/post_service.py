from typing import Optional
from datetime import datetime, timezone
from app.database import supabase


def create_post(post_data: dict) -> dict:
    """Create a new post"""
    result = supabase.table("posts").insert(post_data).execute()
    return result.data[0] if result.data else {}


def get_post(post_id: str) -> Optional[dict]:
    """Get a single post"""
    result = supabase.table("posts").select("*, scheduled_posts(*)").eq("id", post_id).execute()
    return result.data[0] if result.data else None


def posts_list(
    brand_id: Optional[str] = None,
    user_id: Optional[str] = None,
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
) -> list[dict]:
    """List posts with filters"""
    query = supabase.table("posts").select("*, brands(name), scheduled_posts(*)")

    if brand_id:
        query = query.eq("brand_id", brand_id)
    if user_id:
        query = query.eq("user_id", user_id)
    if status:
        query = query.eq("status", status)

    offset = (page - 1) * limit
    result = query.order("created_at", desc=True).limit(limit).execute()

    return result.data or []


def posts_by_date_range(start_date: str, end_date: str, brand_id: Optional[str] = None) -> list[dict]:
    """Get posts in a date range (for calendar view)"""
    query = (
        supabase.table("posts")
        .select("*, brands(name), scheduled_posts(*)")
        .gte("scheduled_at", start_date)
        .lte("scheduled_at", end_date)
    )

    if brand_id:
        query = query.eq("brand_id", brand_id)

    result = query.order("scheduled_at").execute()
    return result.data or []


def update_post(post_id: str, updates: dict) -> dict:
    """Update post data"""
    result = supabase.table("posts").update(updates).eq("id", post_id).execute()
    return result.data[0] if result.data else {}


def delete_post(post_id: str) -> bool:
    """Delete a post and its schedules"""
    supabase.table("scheduled_posts").delete().eq("post_id", post_id).execute()
    result = supabase.table("posts").delete().eq("id", post_id).execute()
    return len(result.data) > 0


def count_posts(brand_id: Optional[str] = None, status: Optional[str] = None) -> int:
    """Count posts with filters"""
    query = supabase.table("posts").select("id", count="exact")

    if brand_id:
        query = query.eq("brand_id", brand_id)
    if status:
        query = query.eq("status", status)

    result = query.execute()
    return result.count or 0
