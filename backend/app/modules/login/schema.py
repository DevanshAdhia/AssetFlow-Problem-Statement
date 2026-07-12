from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class LoginBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255, description="Name of the login")
    description: str = Field(default="", max_length=5000, description="Description")

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()


class LoginCreate(LoginBase):
    pass


class LoginUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    is_active: Optional[bool] = None


class LoginResponse(LoginBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LoginListResponse(BaseModel):
    success: bool = True
    pagination: dict
    results: list[LoginResponse]
