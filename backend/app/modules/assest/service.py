import logging
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.assest.model import Assest
from app.modules.assest.repository import AssestRepository
from app.modules.assest.schema import AssestCreate, AssestUpdate
from app.common.exceptions import NotFoundException

logger = logging.getLogger(__name__)


class AssestService:

    def __init__(self, db: AsyncSession):
        self.repo = AssestRepository(db)

    async def list(
        self,
        page: int = 1,
        page_size: int = 20,
        active_only: bool = True,
    ) -> Tuple[List[Assest], int]:
        skip = (page - 1) * page_size
        return await self.repo.get_all(skip=skip, limit=page_size, active_only=active_only)

    async def get(self, pk: int) -> Assest:
        instance = await self.repo.get_by_id(pk)
        if not instance:
            raise NotFoundException("Assest", pk)
        return instance

    async def create(self, data: AssestCreate) -> Assest:
        instance = await self.repo.create(
            tag=data.tag,
            name=data.name,
            description=data.description,
            status=data.status,
            current_holder=data.currentHolder,
            location=data.location,
            condition=data.condition,
        )
        logger.info("Assest created: id=%s name=%s", instance.id, instance.name)
        return instance

    async def update(self, pk: int, data: AssestUpdate) -> Assest:
        instance = await self.get(pk)
        updated = await self.repo.update(
            instance,
            tag=data.tag,
            name=data.name,
            description=data.description,
            status=data.status,
            current_holder=data.currentHolder,
            location=data.location,
            condition=data.condition,
            is_active=data.is_active,
        )
        logger.info("Assest updated: id=%s", updated.id)
        return updated

    async def delete(self, pk: int) -> None:
        instance = await self.get(pk)
        await self.repo.delete(instance)
        logger.info("Assest deleted: id=%s", pk)

    async def search(self, query: str) -> List[Assest]:
        return await self.repo.search(query)
