from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.assest.model import Assest


class AssestRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, pk: int) -> Optional[Assest]:
        result = await self.db.execute(select(Assest).where(Assest.id == pk))
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 20, active_only: bool = True) -> Tuple[List[Assest], int]:
        query = select(Assest)
        count_query = select(func.count()).select_from(Assest)
        if active_only:
            query = query.where(Assest.is_active.is_(True))
            count_query = count_query.where(Assest.is_active.is_(True))
        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()
        result = await self.db.execute(query.offset(skip).limit(limit).order_by(Assest.id.desc()))
        items = list(result.scalars().all())
        return items, total

    async def create(self, name: str, description: str = "") -> Assest:
        instance = Assest(name=name, description=description)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def update(self, instance: Assest, **kwargs) -> Assest:
        for field, value in kwargs.items():
            if value is not None:
                setattr(instance, field, value)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def delete(self, instance: Assest) -> None:
        await self.db.delete(instance)
        await self.db.flush()

    async def search(self, query: str) -> List[Assest]:
        result = await self.db.execute(
            select(Assest).where(
                Assest.name.ilike(f"%{query}%")
                | Assest.description.ilike(f"%{query}%")
            )
        )
        return list(result.scalars().all())
