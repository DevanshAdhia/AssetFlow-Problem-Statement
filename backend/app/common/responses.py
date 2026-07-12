from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Success"
    data: Optional[T] = None


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: dict = {}


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail


class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    pagination: dict
    results: List[T]


def ok(data: Any = None, message: str = "Success") -> dict:
    payload: dict = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    return payload


def created(data: Any, message: str = "Created successfully") -> dict:
    return {"success": True, "message": message, "data": data}
