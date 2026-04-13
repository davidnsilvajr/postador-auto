from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services import brand_service

router = APIRouter(prefix="/api/v1/brands", tags=["Brands"])


@router.get("/")
def list_brands(user_id: str):
    return brand_service.get_brands(user_id)


@router.get("/{brand_id}")
def get_brand(brand_id: str):
    brand = brand_service.get_brand(brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand


@router.post("/")
def create_brand(brand_data: dict):
    return brand_service.create_brand(
        user_id=brand_data["user_id"],
        name=brand_data["name"],
        industry=brand_data.get("industry", ""),
        description=brand_data.get("description", ""),
        tone_of_voice=brand_data.get("tone_of_voice", "professional"),
    )


@router.put("/{brand_id}")
def update_brand(brand_id: str, updates: dict):
    return brand_service.update_brand(brand_id, updates)


@router.delete("/{brand_id}")
def delete_brand(brand_id: str):
    success = brand_service.delete_brand(brand_id)
    if not success:
        raise HTTPException(status_code=404, detail="Brand not found")
    return {"status": "deleted"}


# Guideline
@router.post("/{brand_id}/guideline")
def save_guideline(brand_id: str, guideline: dict):
    return brand_service.save_guideline(brand_id, guideline)


@router.post("/{brand_id}/logo")
async def upload_logo(brand_id: str, file: UploadFile = File(...)):
    content_type = file.content_type or "image/png"
    file_bytes = await file.read()
    return brand_service.upload_logo(brand_id, file_bytes, file.filename, content_type)


# Content pillars
@router.get("/{brand_id}/content-pillars")
def get_content_pillars(brand_id: str):
    from app.services import ai_service
    pillars = ai_service.suggest_content_pillars(brand_id)
    return pillars


# Monthly calendar
@router.get("/{brand_id}/monthly-calendar/{year}/{month}")
def get_monthly_calendar(brand_id: str, year: int, month: int):
    from app.services import ai_service
    calendar = ai_service.generate_monthly_calendar(brand_id, month, year)
    return calendar
