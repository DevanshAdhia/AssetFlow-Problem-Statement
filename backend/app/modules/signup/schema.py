from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class SignupBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255, description="Name of the signup")
    description: str = Field(default="", max_length=5000, description="Description")

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()


class SignupCreate(SignupBase):
    pass


class SignupUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    is_active: Optional[bool] = None


class SignupResponse(SignupBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SignupListResponse(BaseModel):
    success: bool = True
    pagination: dict
    results: list[SignupResponse]
