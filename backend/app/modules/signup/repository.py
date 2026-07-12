from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.signup.model import Signup


class SignupRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, pk: int) -> Optional[Signup]:
        result = await self.db.execute(select(Signup).where(Signup.id == pk))
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 20, active_only: bool = True) -> Tuple[List[Signup], int]:
        query = select(Signup)
        count_query = select(func.count()).select_from(Signup)
        if active_only:
            query = query.where(Signup.is_active.is_(True))
            count_query = count_query.where(Signup.is_active.is_(True))
        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()
        result = await self.db.execute(query.offset(skip).limit(limit).order_by(Signup.id.desc()))
        items = list(result.scalars().all())
        return items, total

    async def create(self, name: str, description: str = "") -> Signup:
        instance = Signup(name=name, description=description)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def update(self, instance: Signup, **kwargs) -> Signup:
        for field, value in kwargs.items():
            if value is not None:
                setattr(instance, field, value)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def delete(self, instance: Signup) -> None:
        await self.db.delete(instance)
        await self.db.flush()

    async def search(self, query: str) -> List[Signup]:
        result = await self.db.execute(
            select(Signup).where(
                Signup.name.ilike(f"%{query}%")
                | Signup.description.ilike(f"%{query}%")
            )
        )
        return list(result.scalars().all())
