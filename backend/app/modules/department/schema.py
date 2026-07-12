"""Pydantic schemas for validating organization directories, categories, locations, and roles.

Defines payloads and response schemas for all Organization Setup tabs.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


# --- Department Schemas ---

class DepartmentCreate(BaseModel):
    """Schema for validating new department creation requests."""

    name: str = Field(..., min_length=2, max_length=255, description="Name of the department.")
    head: Optional[str] = Field(default=None, max_length=255, description="Department head.")
    parent: Optional[str] = Field(default=None, max_length=255, description="Parent department group.")
    status: Optional[str] = Field(default="Active", max_length=50, description="Department status.")

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        """Strip leading and trailing whitespaces."""
        return v.strip()


class DepartmentResponse(BaseModel):
    """Schema for returning detailed department profiles."""

    id: int
    name: str
    head: Optional[str] = None
    parent: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DepartmentListResponse(BaseModel):
    """Schema representing paginated department directory entries."""

    success: bool = True
    pagination: dict
    results: list[DepartmentResponse]

    model_config = ConfigDict(from_attributes=True)


# --- Category Schemas ---

class AssetCategoryCreate(BaseModel):
    """Schema for validating new asset category creations."""

    name: str = Field(..., min_length=2, max_length=255, description="Category name.")
    description: Optional[str] = Field(default="", max_length=1000, description="Summary description.")
    total_assets_initial: Optional[int] = Field(default=0, description="Initial total asset count.")

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        """Strip leading and trailing whitespaces."""
        return v.strip()


class AssetCategoryResponse(BaseModel):
    """Schema representing a registered asset category."""

    id: int
    name: str
    description: Optional[str] = ""
    total_assets: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AssetCategoryListResponse(BaseModel):
    """Schema representing a paginated collection of categories."""

    success: bool = True
    pagination: dict
    results: list[AssetCategoryResponse]

    model_config = ConfigDict(from_attributes=True)


# --- Location Schemas ---

class LocationCreate(BaseModel):
    """Schema for validating new location creation requests."""

    name: str = Field(..., min_length=2, max_length=255, description="Location name.")
    type: str = Field(..., min_length=2, max_length=100, description="Type of facility, e.g. Office.")
    capacity: int = Field(default=0, ge=0, description="Estimated asset capacity.")
    status: Optional[str] = Field(default="Active", max_length=50, description="Status code.")

    @field_validator("name", "type")
    @classmethod
    def strip_fields(cls, v: str) -> str:
        """Trim whitespace characters."""
        return v.strip()


class LocationResponse(BaseModel):
    """Schema representing a physical location directory entry."""

    id: int
    name: str
    type: str
    capacity: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LocationListResponse(BaseModel):
    """Schema representing a paginated directory of locations."""

    success: bool = True
    pagination: dict
    results: list[LocationResponse]

    model_config = ConfigDict(from_attributes=True)


# --- Employee Directory Schemas ---

class EmployeeCreate(BaseModel):
    """Schema for validating new employee creation request payloads."""

    name: str = Field(..., min_length=2, max_length=255, description="Full name of employee.")
    email: EmailStr = Field(..., description="Email address.")
    department: Optional[str] = Field(default=None, description="Department name assignment.")
    role: str = Field(default="Employee", description="System role identifier.")

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        """Trim whitespace characters."""
        return v.strip()


class EmployeeResponse(BaseModel):
    """Schema representing employee role and department assignments."""

    user_id: int
    name: str
    email: str
    department: Optional[str] = None
    role: str = "Employee"

    model_config = ConfigDict(from_attributes=True)


class EmployeeListResponse(BaseModel):
    """Schema representing paginated employee list."""

    success: bool = True
    pagination: dict
    results: list[EmployeeResponse]

    model_config = ConfigDict(from_attributes=True)


class AssignRoleRequest(BaseModel):
    """Schema to assign/update system roles for an employee."""

    role: str = Field(..., description="Role system identifier.")


class AssignDepartmentRequest(BaseModel):
    """Schema to assign/update departments for an employee."""

    department_id: int = Field(..., description="Department ID assignment.")
