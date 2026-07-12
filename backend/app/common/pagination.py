from typing import Generic, List, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = 1
    page_size: int = 20

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


class Page(BaseModel, Generic[T]):
    success: bool = True
    pagination: dict
    results: List[T]

    @classmethod
    def create(cls, items: List[T], total: int, params: PaginationParams) -> "Page[T]":
        import math
        total_pages = math.ceil(total / params.page_size) if params.page_size > 0 else 0
        return cls(
            pagination={
                "count": total,
                "total_pages": total_pages,
                "current_page": params.page,
                "page_size": params.page_size,
            },
            results=items,
        )
