"""API routes for managing organization departments, categories, locations, and roles.

Exposes REST endpoints supporting all operations on the Organization Setup screen tabs.
"""

import math
from typing import Annotated
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.department.schema import (
    DepartmentCreate,
    DepartmentResponse,
    DepartmentListResponse,
    AssetCategoryCreate,
    AssetCategoryResponse,
    AssetCategoryListResponse,
    LocationCreate,
    LocationResponse,
    LocationListResponse,
    EmployeeCreate,
    EmployeeResponse,
    EmployeeListResponse,
    AssignRoleRequest,
    AssignDepartmentRequest,
)
from app.modules.department.service import DepartmentService

router = APIRouter()


# --- Department Routes ---

@router.post(
    "",
    response_model=DepartmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add New Department",
    description="Registers a new organizational department. Admin authorization required.",
)
async def create_department(
    data: DepartmentCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> DepartmentResponse:
    """Create a new department."""
    svc = DepartmentService(db)
    return await svc.create_department(data, current_user_id)


@router.get(
    "",
    response_model=DepartmentListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Departments",
    description="Fetch a paginated directory of departments.",
)
async def list_departments(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1, description="Page index."),
    page_size: int = Query(20, ge=1, le=200, description="Page size."),
) -> dict:
    """List departments."""
    svc = DepartmentService(db)
    items, total = await svc.list_departments(page=page, page_size=page_size)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": items,
    }


# --- Category Routes ---

@router.post(
    "/categories",
    response_model=AssetCategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Asset Category",
    description="Registers a new asset category classification. Admin only.",
)
async def create_category(
    data: AssetCategoryCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> AssetCategoryResponse:
    """Create a new category."""
    svc = DepartmentService(db)
    return await svc.create_category(data, current_user_id)


@router.get(
    "/categories",
    response_model=AssetCategoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Asset Categories",
    description="Fetch registered categories with dynamic asset counts.",
)
async def list_categories(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1, description="Page index."),
    page_size: int = Query(20, ge=1, le=200, description="Page size."),
) -> dict:
    """List categories."""
    svc = DepartmentService(db)
    items, total = await svc.list_categories(page=page, page_size=page_size)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": items,
    }


# --- Location Routes ---

@router.post(
    "/locations",
    response_model=LocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Location",
    description="Registers a new physical location. Admin only.",
)
async def create_location(
    data: LocationCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> LocationResponse:
    """Create a new location."""
    svc = DepartmentService(db)
    return await svc.create_location(data, current_user_id)


@router.get(
    "/locations",
    response_model=LocationListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Locations",
    description="Fetch a paginated directory of locations.",
)
async def list_locations(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1, description="Page index."),
    page_size: int = Query(20, ge=1, le=200, description="Page size."),
) -> dict:
    """List locations."""
    svc = DepartmentService(db)
    items, total = await svc.list_locations(page=page, page_size=page_size)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": items,
    }


# --- Employee Directory Routes ---

@router.post(
    "/employees",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register Employee",
    description="Creates a new employee record and assigns their initial role and department. Admin only.",
)
async def register_employee(
    data: EmployeeCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> EmployeeResponse:
    """Register a new employee."""
    svc = DepartmentService(db)
    return await svc.register_employee(data, current_user_id)


@router.get(
    "/employees",
    response_model=EmployeeListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Employees Directory",
    description="Fetch a paginated registry of employees with their assigned roles and departments.",
)
async def list_employees(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1, description="Page index."),
    page_size: int = Query(20, ge=1, le=200, description="Page size."),
) -> dict:
    """List employee directory."""
    svc = DepartmentService(db)
    items, total = await svc.list_employees(page=page, page_size=page_size)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": items,
    }


@router.put(
    "/employees/{user_id}/role",
    status_code=status.HTTP_200_OK,
    summary="Assign System Role",
    description="Modify the authorized system role designation of an employee. Admin only.",
)
async def assign_role(
    user_id: int,
    payload: AssignRoleRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> dict:
    """Assign system role."""
    svc = DepartmentService(db)
    await svc.assign_employee_role(target_user_id=user_id, role=payload.role, admin_user_id=current_user_id)
    return {"success": True, "message": f"Role '{payload.role}' successfully assigned to user ID {user_id}."}


@router.put(
    "/employees/{user_id}/department",
    status_code=status.HTTP_200_OK,
    summary="Assign Department",
    description="Assign or modify the department group mapping of an employee. Admin only.",
)
async def assign_department(
    user_id: int,
    payload: AssignDepartmentRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> dict:
    """Assign department."""
    svc = DepartmentService(db)
    await svc.assign_employee_department(target_user_id=user_id, department_id=payload.department_id, admin_user_id=current_user_id)
    return {"success": True, "message": f"Department ID {payload.department_id} successfully assigned to user ID {user_id}."}
