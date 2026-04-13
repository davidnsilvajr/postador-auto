from fastapi import APIRouter
from app.services import social_publish

router = APIRouter(prefix="/api/v1/social-accounts", tags=["Social Accounts"])


@router.get("/")
def get_accounts(user_id: str):
    return social_publish.get_social_accounts(user_id)


@router.post("/")
def connect_account(account_data: dict):
    return social_publish.connect_social_account(
        user_id=account_data["user_id"],
        platform=account_data["platform"],
        access_token=account_data.get("access_token", ""),
        page_id=account_data.get("page_id"),
    )


@router.delete("/{account_id}")
def disconnect_account(account_id: str):
    from app.database import supabase

    result = supabase.table("social_accounts").delete().eq("id", account_id).execute()
    return {"status": "disconnected"}
