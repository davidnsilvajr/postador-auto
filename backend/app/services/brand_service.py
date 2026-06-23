from typing import Optional
from app.database import supabase


def create_brand(
    user_id: str,
    name: str,
    industry: str = "",
    description: str = "",
    tone_of_voice: str = "professional",
    website: str = "",
    target_audience: str = "",
    company_info: str = "",
) -> dict:
    """Create a new brand / client persona"""
    row = {
        "user_id": user_id,
        "name": name,
        "industry": industry,
        "description": description,
        "tone_of_voice": tone_of_voice,
        "website": website,
    }

    # Columns added by migration 0002 — may not exist yet
    extra_cols = {}
    if target_audience:
        extra_cols["target_audience"] = target_audience
    if company_info:
        extra_cols["company_info"] = company_info

    try:
        result = supabase.table("brands").insert({**row, **extra_cols}).execute()
    except Exception:
        # Migration 0002 not applied yet — insert without extra columns
        result = supabase.table("brands").insert(row).execute()

    return result.data[0] if result.data else {}


def get_brands(user_id: str) -> list[dict]:
    """Get all brands for a user"""
    result = supabase.table("brands").select("*").eq("user_id", user_id).execute()
    return result.data or []


def get_brand(brand_id: str) -> Optional[dict]:
    """Get a single brand by ID"""
    result = supabase.table("brands").select("*, brand_guidelines(*), social_accounts(*)").eq("id", brand_id).execute()
    return result.data[0] if result.data else None


def update_brand(brand_id: str, updates: dict) -> dict:
    """Update brand information"""
    try:
        result = supabase.table("brands").update(updates).eq("id", brand_id).execute()
    except Exception:
        # Migration 0002 not applied — strip extra columns and retry
        safe = {k: v for k, v in updates.items() if k not in ("target_audience", "company_info")}
        result = supabase.table("brands").update(safe).eq("id", brand_id).execute()
    return result.data[0] if result.data else {}


def save_guideline(brand_id: str, guideline: dict) -> dict:
    """Create or update brand guidelines"""
    existing = supabase.table("brand_guidelines").select("*").eq("brand_id", brand_id).execute()

    if existing.data:
        result = supabase.table("brand_guidelines").update(guideline).eq("brand_id", brand_id).execute()
    else:
        guideline["brand_id"] = brand_id
        result = supabase.table("brand_guidelines").insert(guideline).execute()

    return result.data[0] if result.data else {}


def upload_logo(brand_id: str, file_bytes: bytes, filename: str, content_type: str) -> dict:
    """Upload brand logo to Supabase Storage"""
    file_path = f"logos/{brand_id}/{filename}"

    upload_result = supabase.storage.from_("brand-assets").upload(
        file_path, file_bytes, {"content-type": content_type}
    )

    url = supabase.storage.from_("brand-assets").get_public_url(file_path)

    # Update brand guideline with logo URL
    existing = supabase.table("brand_guidelines").select("*").eq("brand_id", brand_id).execute()

    guideline_data = {"logo_url": url}
    if existing.data:
        # Append to variants
        variants = existing.data[0].get("logo_variants") or []
        variants.append(url)
        guideline_data["logo_variants"] = variants

        result = supabase.table("brand_guidelines").update(guideline_data).eq("brand_id", brand_id).execute()
    else:
        guideline_data["brand_id"] = brand_id
        guideline_data["logo_variants"] = [url]
        result = supabase.table("brand_guidelines").insert(guideline_data).execute()

    return {"url": url, "guideline": result.data[0] if result.data else {}}


def delete_brand(brand_id: str) -> bool:
    """Delete a brand and all related data"""
    supabase.table("brand_guidelines").delete().eq("brand_id", brand_id).execute()
    supabase.table("posts").delete().eq("brand_id", brand_id).execute()

    result = supabase.table("brands").delete().eq("id", brand_id).execute()
    return len(result.data) > 0
