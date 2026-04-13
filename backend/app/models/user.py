from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: str
    name: str
    password: str
    company_name: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    company_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: str
    password: str
