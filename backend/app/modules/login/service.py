import logging
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.login.model import Login
from app.modules.login.repository import LoginRepository
from app.modules.login.schema import LoginCreate, LoginUpdate
from app.common.exceptions import NotFoundException

logger = logging.getLogger(__name__)


class LoginService:

    def __init__(self, db: AsyncSession):
        self.repo = LoginRepository(db)

    async def list(
        self,
        page: int = 1,
        page_size: int = 20,
        active_only: bool = True,
    ) -> Tuple[List[Login], int]:
        skip = (page - 1) * page_size
        return await self.repo.get_all(skip=skip, limit=page_size, active_only=active_only)

    async def get(self, pk: int) -> Login:
        instance = await self.repo.get_by_id(pk)
        if not instance:
            raise NotFoundException("Login", pk)
        return instance

    async def create(self, data: LoginCreate) -> Login:
        instance = await self.repo.create(name=data.name, description=data.description)
        logger.info("Login created: id=%s name=%s", instance.id, instance.name)
        return instance

    async def update(self, pk: int, data: LoginUpdate) -> Login:
        instance = await self.get(pk)
        updated = await self.repo.update(
            instance,
            name=data.name,
            description=data.description,
            is_active=data.is_active,
        )
        logger.info("Login updated: id=%s", updated.id)
        return updated

    async def delete(self, pk: int) -> None:
        instance = await self.get(pk)
        await self.repo.delete(instance)
        logger.info("Login deleted: id=%s", pk)

    async def search(self, query: str) -> List[Login]:
        return await self.repo.search(query)
