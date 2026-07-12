"""Database repository layer for managing departments, categories, locations, and user roles.

Implements query abstractions for all Organization Setup components.
"""

from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.department.model import Department, UserRole, AssetCategory, Location, UserDepartment


class DepartmentRepository:
    """Repository layer managing organizational Department database queries."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the repository.

        Args:
            db (AsyncSession): Asynchronous database session.
        """
        self.db = db

    async def get_by_id(self, pk: int) -> Optional[Department]:
        """Fetch a single department profile by its ID.

        Args:
            pk (int): Primary key ID.

        Returns:
            Optional[Department]: Department instance if found.
        """
        result = await self.db.execute(select(Department).where(Department.id == pk))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Optional[Department]:
        """Fetch a single department by its unique name.

        Args:
            name (str): Department name.

        Returns:
            Optional[Department]: Department instance if found.
        """
        result = await self.db.execute(select(Department).where(Department.name == name))
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 20) -> Tuple[List[Department], int]:
        """Fetch a paginated collection of departments and the total count.

        Args:
            skip (int, optional): Offset number. Defaults to 0.
            limit (int, optional): Page size. Defaults to 20.

        Returns:
            Tuple[List[Department], int]: Collection list and total count integer.
        """
        query = select(Department)
        count_query = select(func.count()).select_from(Department)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        result = await self.db.execute(query.offset(skip).limit(limit).order_by(Department.id.desc()))
        items = list(result.scalars().all())

        return items, total

    async def create(
        self,
        name: str,
        head: Optional[str] = None,
        parent: Optional[str] = None,
        status: str = "Active",
    ) -> Department:
        """Create a new department record in the database.

        Args:
            name (str): Unique department name.
            head (str, optional): Lead employee. Defaults to None.
            parent (str, optional): Parent grouping. Defaults to None.
            status (str, optional): Initial status. Defaults to "Active".

        Returns:
            Department: The newly created Department instance.
        """
        instance = Department(name=name, head=head, parent=parent, status=status)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance


class UserRoleRepository:
    """Repository layer managing permissions and custom UserRole allocations."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the repository.

        Args:
            db (AsyncSession): Asynchronous database session.
        """
        self.db = db

    async def get_role_by_user_id(self, user_id: int) -> Optional[UserRole]:
        """Fetch the custom role mapping for a given user ID.

        Args:
            user_id (int): User ID.

        Returns:
            Optional[UserRole]: UserRole mapping if found.
        """
        result = await self.db.execute(select(UserRole).where(UserRole.user_id == user_id))
        return result.scalar_one_or_none()

    async def assign_role(self, user_id: int, role: str) -> UserRole:
        """Assign or update a custom system access role to a user.

        Args:
            user_id (int): Target user ID.
            role (str): Custom role string, e.g. 'admin'.

        Returns:
            UserRole: The created or updated UserRole instance.
        """
        role_record = await self.get_role_by_user_id(user_id)
        if role_record:
            role_record.role = role
        else:
            role_record = UserRole(user_id=user_id, role=role)
            self.db.add(role_record)

        await self.db.flush()
        await self.db.refresh(role_record)
        return role_record


class AssetCategoryRepository:
    """Repository layer managing AssetCategory database query transactions."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the repository.

        Args:
            db (AsyncSession): Asynchronous database session.
        """
        self.db = db

    async def get_by_id(self, pk: int) -> Optional[AssetCategory]:
        """Fetch a single asset category record by ID.

        Args:
            pk (int): Primary key ID.

        Returns:
            Optional[AssetCategory]: AssetCategory instance if found.
        """
        result = await self.db.execute(select(AssetCategory).where(AssetCategory.id == pk))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Optional[AssetCategory]:
        """Fetch a single category record by name.

        Args:
            name (str): Category name.

        Returns:
            Optional[AssetCategory]: AssetCategory instance if found.
        """
        result = await self.db.execute(select(AssetCategory).where(AssetCategory.name == name))
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 20) -> Tuple[List[AssetCategory], int]:
        """Fetch a paginated collection of categories.

        Args:
            skip (int): Offset.
            limit (int): Page size.

        Returns:
            Tuple[List[AssetCategory], int]: Collection list and total count.
        """
        query = select(AssetCategory)
        count_query = select(func.count()).select_from(AssetCategory)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        result = await self.db.execute(query.offset(skip).limit(limit).order_by(AssetCategory.id.desc()))
        items = list(result.scalars().all())

        return items, total

    async def create(self, name: str, description: Optional[str] = None) -> AssetCategory:
        """Register a new asset category classification entry.

        Args:
            name (str): Category name.
            description (str, optional): Description summary.

        Returns:
            AssetCategory: The newly registered AssetCategory.
        """
        instance = AssetCategory(name=name, description=description)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance


class LocationRepository:
    """Repository layer managing physical/logical Location database query transactions."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the repository.

        Args:
            db (AsyncSession): Asynchronous database session.
        """
        self.db = db

    async def get_by_id(self, pk: int) -> Optional[Location]:
        """Fetch a single location record by ID.

        Args:
            pk (int): Primary key ID.

        Returns:
            Optional[Location]: Location instance if found.
        """
        result = await self.db.execute(select(Location).where(Location.id == pk))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Optional[Location]:
        """Fetch a location record by unique name.

        Args:
            name (str): Location name.

        Returns:
            Optional[Location]: Location instance if found.
        """
        result = await self.db.execute(select(Location).where(Location.name == name))
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 20) -> Tuple[List[Location], int]:
        """Fetch a paginated collection of locations.

        Args:
            skip (int): Offset.
            limit (int): Page size.

        Returns:
            Tuple[List[Location], int]: Collection list and total count.
        """
        query = select(Location)
        count_query = select(func.count()).select_from(Location)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        result = await self.db.execute(query.offset(skip).limit(limit).order_by(Location.id.desc()))
        items = list(result.scalars().all())

        return items, total

    async def create(self, name: str, type: str, capacity: int, status: str = "Active") -> Location:
        """Register a new physical facility or storage location.

        Args:
            name (str): Unique location name.
            type (str): Facility type (e.g. Office).
            capacity (int): Rated capacity limit.
            status (str, optional): Status code. Defaults to "Active".

        Returns:
            Location: The newly registered Location.
        """
        instance = Location(name=name, type=type, capacity=capacity, status=status)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance


class UserDepartmentRepository:
    """Repository layer managing User to Department relationships."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the repository.

        Args:
            db (AsyncSession): Asynchronous database session.
        """
        self.db = db

    async def get_by_user_id(self, user_id: int) -> Optional[UserDepartment]:
        """Fetch the department mapping for a specific user ID.

        Args:
            user_id (int): Target user identifier.

        Returns:
            Optional[UserDepartment]: Department mapping if found.
        """
        result = await self.db.execute(select(UserDepartment).where(UserDepartment.user_id == user_id))
        return result.scalar_one_or_none()

    async def assign_department(self, user_id: int, department_id: int) -> UserDepartment:
        """Assign or update a user's department assignment.

        Args:
            user_id (int): Target user identifier.
            department_id (int): Associated Department ID.

        Returns:
            UserDepartment: The created or updated mapping.
        """
        record = await self.get_by_user_id(user_id)
        if record:
            record.department_id = department_id
        else:
            record = UserDepartment(user_id=user_id, department_id=department_id)
            self.db.add(record)

        await self.db.flush()
        await self.db.refresh(record)
        return record
