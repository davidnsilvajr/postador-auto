"""
Supabase-based scheduler (no Redis / Celery).

Two approaches:
  1. Cron job / APScheduler calls `execute_published_jobs()` every minute.
  2. (future) Supabase Edge Functions with pg_cron for fully serverless.
"""

from datetime import datetime, timezone, timedelta
from typing import Optional
from app.database import supabase
from app.services.social_publish import publish_post


def schedule_post(post_id: str, platform: str, scheduled_at: str, user_id: str) -> dict:
    """Schedule a post for future publishing (stored in Supabase table)"""
    result = supabase.table("scheduled_posts").insert({
        "post_id": post_id,
        "platform": platform,
        "scheduled_at": scheduled_at,
        "user_id": user_id,
        "status": "scheduled",
    }).execute()

    # Also update the post row for quick filter access
    supabase.table("posts").update({
        "status": "scheduled",
        "scheduled_at": scheduled_at,
    }).eq("id", post_id).execute()

    return result.data[0] if result.data else {}


def get_scheduled_posts(user_id: Optional[str] = None) -> list[dict]:
    query = supabase.table("scheduled_posts").select("*, posts(*)")
    if user_id:
        query = query.eq("user_id", user_id)
    result = query.order("scheduled_at").execute()
    return result.data or []


def cancel_schedule(schedule_id: str) -> bool:
    result = supabase.table("scheduled_posts").update({
        "status": "cancelled",
    }).eq("id", schedule_id).execute()
    return len(result.data) > 0


def auto_schedule(
    post_id: str,
    platform: str,
    preferred_times: Optional[list[str]] = None,
    days_ahead: int = 7,
) -> dict:
    """Intelligently schedule a post based on best times"""
    preferred = preferred_times or ["09:00", "12:00", "18:00", "20:00"]
    now = datetime.now(timezone.utc)

    for time_str in preferred:
        hour, minute = map(int, time_str.split(":"))
        for day_offset in range(1, days_ahead + 1):
            candidate = now.replace(
                hour=hour, minute=minute, second=0, microsecond=0
            ) + timedelta(days=day_offset)

            if candidate > now:
                return schedule_post(post_id, platform, candidate.isoformat(), user_id="") or {}

    return {}


def execute_published_jobs() -> list[dict]:
    """
    Worker: find all posts that should be published RIGHT NOW
    and publish them. Call this every 60s from a background thread
    or from FastAPI on_startup + asyncio loop.
    """
    now = datetime.now(timezone.utc).isoformat()

    result = (
        supabase.table("scheduled_posts")
        .select("*, posts(*)")
        .eq("status", "scheduled")
        .lte("scheduled_at", now)
        .execute()
    )

    due_posts = result.data or []
    outcomes = []

    for scheduled in due_posts:
        post = scheduled.get("posts", {})
        platform = scheduled["platform"]
        user_id = scheduled.get("user_id", "")

        # Get account for this platform
        account_result = (
            supabase.table("social_accounts")
            .select("*")
            .eq("user_id", user_id)
            .eq("platform", platform)
            .execute()
        )
        account = account_result.data[0] if account_result.data else {}

        publish_result = publish_post(post, platform, account)

        if "error" in publish_result:
            supabase.table("scheduled_posts").update({
                "status": "failed",
                "error_message": publish_result["error"],
            }).eq("id", scheduled["id"]).execute()
        else:
            ext_id = publish_result.get("id", publish_result.get("post_id", ""))
            supabase.table("scheduled_posts").update({
                "status": "published",
                "published_at": datetime.now(timezone.utc).isoformat(),
                "external_post_id": ext_id,
            }).eq("id", scheduled["id"]).execute()

            supabase.table("posts").update({
                "status": "published",
                "published_at": datetime.now(timezone.utc).isoformat(),
            }).eq("id", post.get("id")).execute()

        outcomes.append({
            "schedule_id": scheduled["id"],
            "platform": platform,
            "result": publish_result,
        })

    return outcomes
