from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional

from app.schemas import AIContentRequest, AIGeneratedContent, ApprovalRequest
from app.services import ai_service
from app.services import post_service
from app.services import scheduler_service
from app.services import social_publish
from app.database import supabase

router = APIRouter(prefix="/api/v1/posts", tags=["Posts"])


@router.get("/")
def list_posts(
    brand_id: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1),
    limit: int = Query(20),
):
    return post_service.posts_list(brand_id, user_id, status, page, limit)


@router.get("/calendar")
def calendar_view(start_date: str, end_date: str, brand_id: Optional[str] = None):
    posts = post_service.posts_by_date_range(start_date, end_date, brand_id)
    return posts


@router.get("/{post_id}")
def get_post(post_id: str):
    post = post_service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/")
def create_post(post_data: dict):
    post = post_service.create_post(post_data)
    return post


@router.put("/{post_id}")
def update_post(post_id: str, updates: dict):
    return post_service.update_post(post_id, updates)


@router.delete("/{post_id}")
def delete_post(post_id: str):
    success = post_service.delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"status": "deleted"}


# AI Content Generation
@router.post("/generate", response_model=AIGeneratedContent)
def generate_post_content(request: AIContentRequest):
    result = ai_service.generate_post_content(
        topic=request.topic,
        brand_id=request.brand_id,
        platforms=request.platforms,
        tone=request.tone,
        language=request.language,
        campaign=request.campaign,
    )

    # Generate image if requested
    image_url = None
    if request.generate_image and result.get("image_prompt"):
        image_url = ai_service.generate_image(result["image_prompt"], request.brand_id)

    return {**result, "image_url": image_url}


@router.post("/{post_id}/approve")
def approve_post(post_id: str, request: ApprovalRequest):
    post = post_service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if request.action == "approve":
        return post_service.update_post(post_id, {"status": "approved"})
    else:
        return post_service.update_post(
            post_id,
            {
                "status": "rejected",
                "rejection_reason": request.feedback,
            },
        )


@router.post("/approve-bulk")
def approve_bulk_posts(post_ids: list[str]):
    updated = []
    for pid in post_ids:
        result = post_service.update_post(pid, {"status": "approved"})
        updated.append(result)
    return approved


@router.post("/schedule-bulk")
def schedule_bulk(requests: list[dict]):
    results = []
    for req in requests:
        result = scheduler_service.schedule_post(
            req["post_id"], req["platform"], req["scheduled_at"], req.get("user_id", "")
        )
        results.append(result)
    return {"scheduled": len(results), "results": results}


@router.post("/{post_id}/schedule")
def schedule_post(post_id: str, schedule_data: dict):
    return scheduler_service.schedule_post(
        post_id,
        schedule_data["platform"],
        schedule_data["scheduled_at"],
        schedule_data.get("user_id", ""),
    )


@router.get("/{post_id}/schedule")
def get_post_schedules(post_id: str):
    result = (
        supabase.table("scheduled_posts")
        .select("*")
        .eq("post_id", post_id)
        .execute()
    )
    return result.data or []


@router.post("/{post_id}/publish-now")
def publish_now(post_id: str, platforms: list[str]):
    post = post_service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    user_id = post.get("user_id", "")
    accounts = social_publish.get_social_accounts(user_id)

    results = {}
    for platform in platforms:
        account = next((a for a in accounts if a["platform"] == platform), {})
        publish_result = social_publish.publish_post(post, platform, account)
        results[platform] = publish_result

        if "error" not in publish_result:
            post_service.update_post(post_id, {
                "status": "published",
                "published_at": __import__("datetime").datetime.now(__import__("datetime", "timezone").timezone.utc).isoformat(),
            })

    return results


@router.get("/stats/summary")
def stats_summary(brand_id: Optional[str] = None, user_id: Optional[str] = None):
    drafts = post_service.count_posts(brand_id, "draft")
    pending = post_service.count_posts(brand_id, "pending_approval")
    approved = post_service.count_posts(brand_id, "approved")
    scheduled = post_service.count_posts(brand_id, "scheduled")
    published = post_service.count_posts(brand_id, "published")

    return {
        "draft": drafts,
        "pending_approval": pending,
        "approved": approved,
        "scheduled": scheduled,
        "published": published,
        "total": drafts + pending + approved + scheduled + published,
        "pending_approval_list": [],
    }
