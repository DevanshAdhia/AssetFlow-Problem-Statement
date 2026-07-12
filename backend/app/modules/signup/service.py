import logging
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.signup.model import Signup
from app.modules.signup.repository import SignupRepository
from app.modules.signup.schema import SignupCreate, SignupUpdate
from app.common.exceptions import NotFoundException

logger = logging.getLogger(__name__)


class SignupService:

    def __init__(self, db: AsyncSession):
        self.repo = SignupRepository(db)

    async def list(
        self,
        page: int = 1,
        page_size: int = 20,
        active_only: bool = True,
    ) -> Tuple[List[Signup], int]:
        skip = (page - 1) * page_size
        return await self.repo.get_all(skip=skip, limit=page_size, active_only=active_only)

    async def get(self, pk: int) -> Signup:
        instance = await self.repo.get_by_id(pk)
        if not instance:
            raise NotFoundException("Signup", pk)
        return instance

    async def create(self, data: SignupCreate) -> Signup:
        instance = await self.repo.create(name=data.name, description=data.description)
        logger.info("Signup created: id=%s name=%s", instance.id, instance.name)
        return instance

    async def update(self, pk: int, data: SignupUpdate) -> Signup:
        instance = await self.get(pk)
        updated = await self.repo.update(
            instance,
            name=data.name,
            description=data.description,
            is_active=data.is_active,
        )
        logger.info("Signup updated: id=%s", updated.id)
        return updated

    async def delete(self, pk: int) -> None:
        instance = await self.get(pk)
        await self.repo.delete(instance)
        logger.info("Signup deleted: id=%s", pk)

    async def search(self, query: str) -> List[Signup]:
        return await self.repo.search(query)
