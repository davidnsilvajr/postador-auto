from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
from app.database import supabase

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


@router.get("/summary")
def analytics_summary(
    brand_id: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
):
    """Get overall analytics summary"""
    filters = []
    if brand_id:
        filters.append("brand_id", f"eq.{brand_id}")

    date_filter = {}
    if start_date:
        date_filter["gte"] = start_date
    if end_date:
        date_filter["lte"] = end_date

    total_query = supabase.table("posts").select("id", count="exact")
    if brand_id:
        total_query = total_query.eq("brand_id", brand_id)
    total_result = total_query.execute()

    published_query = supabase.table("posts").select("id", count="exact").eq("status", "published")
    if brand_id:
        published_query = published_query.eq("brand_id", brand_id)
    published_result = published_query.execute()

    # Get analytics data
    analytics_query = supabase.table("post_analytics").select("*")
    analytics_result = analytics_query.execute()
    analytics_data = analytics_result.data or []

    total_likes = sum(a.get("likes", 0) for a in analytics_data)
    total_comments = sum(a.get("comments", 0) for a in analytics_data)
    total_impressions = sum(a.get("impressions", 0) for a in analytics_data)
    total_reach = sum(a.get("reach", 0) for a in analytics_data)
    total_shares = sum(a.get("shares", 0) for a in analytics_data)

    engagement = total_likes + total_comments + total_shares
    engagement_rate = (engagement / total_impressions * 100) if total_impressions > 0 else 0

    # Top platforms
    platform_counts = {}
    for a in analytics_data:
        p = a.get("platform", "unknown")
        platform_counts[p] = platform_counts.get(p, 0) + a.get("engagement_rate", 0)

    top_platform = max(platform_counts, key=platform_counts.get) if platform_counts else ""

    return {
        "period": {
            "start": start_date || (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
            "end": end_date || datetime.now().strftime("%Y-%m-%d"),
        },
        "total_posts": published_result.count || 0,
        "total_impressions": total_impressions,
        "total_reach": total_reach,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_shares": total_shares,
        "engagement_rate": round(engagement_rate, 2),
        "top_platform": top_platform,
        "platform_breakdown": platform_counts,
    }


@router.get("/post/{post_id}")
def post_analytics(post_id: str):
    """Get analytics for a specific published post"""
    result = (
        supabase.table("post_analytics")
        .select("*")
        .eq("post_id", post_id)
        .execute()
    )
    return result.data or []


@router.get("/trending-topics")
def get_trending_topics(category: Optional[str] = Query(None)):
    from app.schemas import TrendingTopic
    from app.services import ai_service
    import anthropic

    settings = __import__("app.config", fromlist=["get_settings"]).get_settings()
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    system_prompt = "Você é um especialista em tendências de redes sociais brasileiras. Retorne JSON: {\"topics\": [{\"topic\": \"assunto\", \"category\": \"categoria\", \"confidence\": 0-1}]}"

    response = client.messages.create(
        model="claude-sonnet-4-6-20250514",
        max_tokens=1024,
        temperature=0.5,
        system=system_prompt,
        messages=[{"role": "user", "content": f"Quais são os trending topics para {category || 'geral'} nas redes sociais agora?"}],
    )

    import json
    text = response.content[0].text
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()

    data = json.loads(text)
    return data.get("topics", [])
