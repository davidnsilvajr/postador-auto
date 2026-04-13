import httpx
from typing import Optional
from app.config import get_settings
from app.database import supabase


def get_social_accounts(user_id: str) -> list[dict]:
    """Get connected social accounts for a user"""
    response = (
        supabase.table("social_accounts")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return response.data or []


def connect_social_account(
    user_id: str, platform: str, access_token: str, page_id: Optional[str] = None
) -> dict:
    """Connect a social media account to the brand"""
    try:
        result = supabase.table("social_accounts").insert(
            {
                "user_id": user_id,
                "platform": platform,
                "access_token": access_token,
                "page_id": page_id,
                "status": "active",
            }
        ).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        return {"error": str(e)}


# ========== Platform-specific publishers ==========


def publish_to_instagram(
    caption: str, media_url: str, page_id: str, access_token: str
) -> dict:
    """Publish to Instagram via Meta Graph API"""
    settings = get_settings()
    token = access_token or settings.INSTAGRAM_ACCESS_TOKEN

    # Step 1: Create media container
    container_url = f"https://graph.facebook.com/v21.0/{page_id}/media"
    container_data = {
        "image_url": media_url,
        "caption": caption,
        "access_token": token,
    }

    container_resp = httpx.post(container_url, data=container_data)
    container_result = container_resp.json()

    if "id" not in container_result:
        return {"error": container_result.get("error_message", "Unknown error")}

    # Step 2: Publish container
    import time

    time.sleep(5)  # Wait for container to be ready

    publish_url = f"https://graph.facebook.com/v21.0/{page_id}/media_publish"
    publish_data = {
        "creation_id": container_result["id"],
        "access_token": token,
    }

    publish_resp = httpx.post(publish_url, data=publish_data)
    return publish_resp.json()


def publish_to_facebook(
    caption: str, media_url: str, page_id: str, access_token: str
) -> dict:
    """Publish to Facebook Page via Graph API"""
    settings = get_settings()
    token = access_token or settings.FACEBOOK_ACCESS_TOKEN

    url = f"https://graph.facebook.com/v21.0/{page_id}/feed"
    data = {
        "message": caption,
        "access_token": token,
    }

    if media_url:
        # Upload photo first
        photo_url = f"https://graph.facebook.com/v21.0/{page_id}/photos"
        photo_data = {
            "url": media_url,
            "message": caption,
            "access_token": token,
        }
        resp = httpx.post(photo_url, data=photo_data)
        return resp.json()

    resp = httpx.post(url, data=data)
    return resp.json()


def publish_to_twitter(
    caption: str, media_url: str = "", access_token: Optional[str] = None
) -> dict:
    """Publish to X/Twitter via API v2"""
    settings = get_settings()

    headers = {
        "Authorization": f"Bearer {access_token or settings.TWITTER_BEARER_TOKEN}",
        "Content-Type": "application/json",
    }

    # Upload media if present
    media_ids = []
    if media_url:
        # Twitter media upload via v2 endpoint
        # This would use Twitter's media upload API
        pass

    url = "https://api.twitter.com/2/tweets"
    tweet_data = {"text": caption[:280]}

    if media_ids:
        tweet_data["media"] = {"media_ids": media_ids}

    resp = httpx.post(url, json=tweet_data, headers=headers)
    return resp.json()


def publish_to_linkedin(
    caption: str, media_url: str = "", access_token: Optional[str] = None
) -> dict:
    """Publish to LinkedIn via REST API"""
    settings = get_settings()
    token = access_token or settings.LINKEDIN_ACCESS_TOKEN

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
    }

    # Get person/organization URN
    urn_resp = httpx.get(
        "https://api.linkedin.com/v2/me", headers=headers
    )
    person_urn = urn_resp.json().get("id", "")

    post_data = {
        "author": f"urn:li:person:{person_urn}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": caption},
                "shareMediaCategory": "NONE",
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }

    resp = httpx.post(
        "https://api.linkedin.com/v2/ugcPosts",
        json=post_data,
        headers=headers,
    )
    return resp.json()


def publish_to_tiktok(
    caption: str, video_url: str, access_token: Optional[str] = None
) -> dict:
    """Publish to TikTok via Content Posting API"""
    settings = get_settings()
    token = access_token or settings.TIKTOK_ACCESS_TOKEN

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    # Step 1: Initiate upload
    init_url = "https://open.tiktokapis.com/v2/post/publish/content/init/"
    init_data = {
        "post_info": {
            "title": caption,
            "privacy_level": "PUBLIC",
            "disable_duet": False,
            "disable_comment": False,
            "disable_stitch": False,
        },
        "source_info": {"file_type": "video", "video_url": video_url},
    }

    init_resp = httpx.post(init_url, json=init_data, headers=headers)
    result = init_resp.json()

    # The actual TikTok API uses multipart upload - simplified here
    return result


def get_social_analytics(
    platform: str, post_ids: list[str], access_token: Optional[str] = None
) -> list[dict]:
    """Fetch analytics data for published posts"""
    results = []

    if platform == "instagram":
        token = access_token or ""
        for post_id in post_ids:
            url = f"https://graph.facebook.com/v21.0/{post_id}"
            params = {
                "fields": "like_count,comments_count,saved_count,impression,reach,engagement",
                "access_token": token,
            }
            resp = httpx.get(url, params=params)
            results.append({"platform": "instagram", "data": resp.json()})

    elif platform == "twitter":
        token = access_token or ""
        headers = {"Authorization": f"Bearer {token}"}
        for tweet_id in post_ids:
            url = f"https://api.twitter.com/2/tweets/{tweet_id}"
            params = {
                "tweet.fields": "public_metrics,non_public_metrics"
            }
            resp = httpx.get(url, params=params, headers=headers)
            results.append({"platform": "twitter", "data": resp.json()})

    return results


def publish_post(post: dict, platform: str, account: dict) -> dict:
    """Dispatcher: publish to the specified platform"""
    caption = post.get("caption", "")
    media_urls = [m["url"] for m in post.get("media", [])] if post.get("media") else []
    primary_media = media_urls[0] if media_urls else ""

    platform_map = {
        "instagram": lambda: publish_to_instagram(
            caption, primary_media, account.get("page_id", ""), account.get("access_token", "")
        ),
        "facebook": lambda: publish_to_facebook(
            caption, primary_media, account.get("page_id", ""), account.get("access_token", "")
        ),
        "twitter": lambda: publish_to_twitter(
            caption, primary_media, account.get("access_token", "")
        ),
        "linkedin": lambda: publish_to_linkedin(
            caption, primary_media, account.get("access_token", "")
        ),
        "tiktok": lambda: publish_to_tiktok(
            caption, primary_media, account.get("access_token", "")
        ),
    }

    publisher = platform_map.get(platform)
    if not publisher:
        return {"error": f"Plataforma {platform} não suportada"}

    try:
        result = publisher()
        return result
    except Exception as e:
        return {"error": str(e)}
