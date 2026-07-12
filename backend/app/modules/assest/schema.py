from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class AssestBase(BaseModel):
    tag: str = Field(..., min_length=2, max_length=50, description="Unique tag of the asset")
    name: str = Field(..., min_length=2, max_length=255, description="Name of the assest")
    description: str = Field(default="", max_length=5000, description="Description")
    status: str = Field(default="Available", max_length=50)
    currentHolder: Optional[str] = Field(None, max_length=255, alias="current_holder")
    location: Optional[str] = Field(None, max_length=255)
    condition: str = Field(default="Good", max_length=50)

    model_config = {"populate_by_name": True}

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()


class AssestCreate(AssestBase):
    pass


class AssestUpdate(BaseModel):
    tag: Optional[str] = Field(None, min_length=2, max_length=50)
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    status: Optional[str] = Field(None, max_length=50)
    currentHolder: Optional[str] = Field(None, max_length=255, alias="current_holder")
    location: Optional[str] = Field(None, max_length=255)
    condition: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None

    model_config = {"populate_by_name": True}


class AssestResponse(AssestBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True, "populate_by_name": True}


class AssestListResponse(BaseModel):
    success: bool = True
    pagination: dict
    results: list[AssestResponse]

class AssestTransferRequest(BaseModel):
    assetId: str
    to: str
    reason: str

