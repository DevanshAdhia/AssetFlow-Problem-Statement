"""Business logic services for managing departments, categories, locations, and employee assignments.

Implements access validation filters and core transaction operations for the Organization Setup page.
"""

from typing import List, Tuple, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.department.model import Department, AssetCategory, Location, UserRole, UserDepartment
from app.modules.department.repository import (
    DepartmentRepository,
    UserRoleRepository,
    AssetCategoryRepository,
    LocationRepository,
    UserDepartmentRepository,
)
from app.modules.signup.model import User
from app.modules.assest.model import Assest
from app.core.security import get_password_hash
from app.modules.department.schema import (
    DepartmentCreate,
    AssetCategoryCreate,
    LocationCreate,
    EmployeeCreate,
    EmployeeResponse,
)
from app.common.exceptions import ConflictException, ForbiddenException, NotFoundException, AppException


class DepartmentService:
    """Service layer coordinating business rules for organizational setups."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the department service.

        Args:
            db (AsyncSession): Asynchronous database session.
        """
        self.db = db
        self.dept_repo = DepartmentRepository(db)
        self.role_repo = UserRoleRepository(db)
        self.cat_repo = AssetCategoryRepository(db)
        self.loc_repo = LocationRepository(db)
        self.user_dept_repo = UserDepartmentRepository(db)

    async def check_is_admin(self, user_id: int) -> bool:
        """Determine if a user ID holds administrative access clearance.

        Evaluates the user's role in the DB alongside a developer email fallback.

        Args:
            user_id (int): ID of the user.

        Returns:
            bool: True if authorized as admin, otherwise False.
        """
        user_result = await self.db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            return False

        # Email-based fallback check (easy for local developer testing)
        if "admin" in user.email.lower():
            return True

        # Database UserRole check
        user_role = await self.role_repo.get_role_by_user_id(user_id)
        if user_role and user_role.role.lower() == "admin":
            return True

        return False

    # --- Department Methods ---

    async def list_departments(self, page: int = 1, page_size: int = 20) -> Tuple[List[Department], int]:
        """Retrieve a paginated collection of departments.

        Args:
            page (int, optional): Page index. Defaults to 1.
            page_size (int, optional): Page size. Defaults to 20.

        Returns:
            Tuple[List[Department], int]: Matched departments and total count.
        """
        skip = (page - 1) * page_size
        return await self.dept_repo.get_all(skip=skip, limit=page_size)

    async def create_department(self, data: DepartmentCreate, user_id: int) -> Department:
        """Complete new department registration if authorized.

        Args:
            data (DepartmentCreate): Input validation model.
            user_id (int): Requesting user ID.

        Returns:
            Department: The newly created Department.

        Raises:
            ForbiddenException: If the user is not an administrator.
            ConflictException: If a department with the name already exists.
        """
        is_admin = await self.check_is_admin(user_id)
        if not is_admin:
            raise ForbiddenException("Only administrators can add new departments.")

        existing = await self.dept_repo.get_by_name(data.name)
        if existing:
            raise ConflictException(f"Department with name '{data.name}' already exists.")

        return await self.dept_repo.create(
            name=data.name,
            head=data.head,
            parent=data.parent,
            status=data.status or "Active",
        )

    # --- Category Methods ---

    async def create_category(self, data: AssetCategoryCreate, user_id: int) -> AssetCategory:
        """Create a new asset category if user is authorized.

        Args:
            data (AssetCategoryCreate): Input validation model.
            user_id (int): Requesting user ID.

        Returns:
            AssetCategory: The newly created category.

        Raises:
            ForbiddenException: If the user is not an admin.
            ConflictException: If a category with the name already exists.
        """
        is_admin = await self.check_is_admin(user_id)
        if not is_admin:
            raise ForbiddenException("Only administrators can add new asset categories.")

        existing = await self.cat_repo.get_by_name(data.name)
        if existing:
            raise ConflictException(f"Asset category with name '{data.name}' already exists.")

        return await self.cat_repo.create(name=data.name, description=data.description)

    async def list_categories(self, page: int = 1, page_size: int = 20) -> Tuple[List[AssetCategory], int]:
        """Fetch a paginated collection of categories with dynamic asset counts.

        Args:
            page (int): Page index.
            page_size (int): Max items per page.

        Returns:
            Tuple[List[AssetCategory], int]: Category instances and total count.
        """
        skip = (page - 1) * page_size
        categories, total = await self.cat_repo.get_all(skip=skip, limit=page_size)

        # Compute dynamic asset counts for each category
        for cat in categories:
            count_query = select(func.count()).select_from(Assest).where(Assest.category == cat.name)
            count_result = await self.db.execute(count_query)
            cat.total_assets = count_result.scalar_one()

        return categories, total

    # --- Location Methods ---

    async def create_location(self, data: LocationCreate, user_id: int) -> Location:
        """Create a physical/logical location if authorized.

        Args:
            data (LocationCreate): Input validation model.
            user_id (int): Requesting user ID.

        Returns:
            Location: The newly created Location.

        Raises:
            ForbiddenException: If the user is not an admin.
            ConflictException: If a location with the name already exists.
        """
        is_admin = await self.check_is_admin(user_id)
        if not is_admin:
            raise ForbiddenException("Only administrators can add new locations.")

        existing = await self.loc_repo.get_by_name(data.name)
        if existing:
            raise ConflictException(f"Location with name '{data.name}' already exists.")

        return await self.loc_repo.create(
            name=data.name,
            type=data.type,
            capacity=data.capacity,
            status=data.status or "Active",
        )

    async def list_locations(self, page: int = 1, page_size: int = 20) -> Tuple[List[Location], int]:
        """Fetch a paginated list of locations.

        Args:
            page (int): Page index.
            page_size (int): Max items.

        Returns:
            Tuple[List[Location], int]: Locations and total count.
        """
        skip = (page - 1) * page_size
        return await self.loc_repo.get_all(skip=skip, limit=page_size)

    # --- Employee Directory Methods ---

    async def list_employees(self, page: int = 1, page_size: int = 20) -> Tuple[List[EmployeeResponse], int]:
        """Fetch a paginated collection of employee directory profiles.

        Aggregates data from User, UserRole, and UserDepartment.

        Args:
            page (int): Page index.
            page_size (int): Items per page.

        Returns:
            Tuple[List[EmployeeResponse], int]: Employee list and total count.
        """
        skip = (page - 1) * page_size
        
        # Query total count
        count_query = select(func.count()).select_from(User)
        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        # Query paginated users
        user_query = select(User).offset(skip).limit(page_size).order_by(User.id.desc())
        users_result = await self.db.execute(user_query)
        users = list(users_result.scalars().all())

        results: List[EmployeeResponse] = []
        for user in users:
            # 1. Fetch system role mapping
            role_record = await self.role_repo.get_role_by_user_id(user.id)
            system_role = role_record.role if role_record else "Employee"

            # 2. Fetch department name
            dept_name: Optional[str] = None
            dept_map = await self.user_dept_repo.get_by_user_id(user.id)
            if dept_map:
                dept_record = await self.dept_repo.get_by_id(dept_map.department_id)
                if dept_record:
                    dept_name = dept_record.name

            results.append(
                EmployeeResponse(
                    user_id=user.id,
                    name=user.full_name,
                    email=user.email,
                    department=dept_name,
                    role=system_role,
                )
            )

        return results, total

    async def register_employee(self, data: EmployeeCreate, admin_user_id: int) -> EmployeeResponse:
        """Register a new user employee via the admin panel.

        Args:
            data (EmployeeCreate): Validation inputs.
            admin_user_id (int): Requesting administrator user ID.

        Returns:
            EmployeeResponse: The profile details of the registered user.

        Raises:
            ForbiddenException: If requesting user is not an administrator.
            ConflictException: If the email is already registered.
            AppException: If the role is invalid.
        """
        is_admin = await self.check_is_admin(admin_user_id)
        if not is_admin:
            raise ForbiddenException("Only administrators can register new employees.")

        # Check unique email
        existing_user_result = await self.db.execute(select(User).where(User.email == data.email))
        existing_user = existing_user_result.scalar_one_or_none()
        if existing_user:
            raise ConflictException(f"Employee email '{data.email}' is already registered.")

        # Validate role
        allowed_roles = {"Department Head", "Employee", "Asset Manager", "Admin"}
        if data.role not in allowed_roles:
            raise AppException(f"Invalid role '{data.role}'. Allowed roles: {list(allowed_roles)}", code="invalid_role")

        # Create user
        hashed_pwd = get_password_hash("AssetFlow123!")
        new_user = User(
            email=data.email,
            full_name=data.name,
            hashed_password=hashed_pwd,
            auth_provider="email",
            is_active=True,
        )
        self.db.add(new_user)
        await self.db.flush()
        await self.db.refresh(new_user)

        # Map role
        await self.role_repo.assign_role(new_user.id, data.role)

        # Map department if provided and matches existing department name
        dept_name: Optional[str] = None
        if data.department:
            dept = await self.dept_repo.get_by_name(data.department)
            if dept:
                await self.user_dept_repo.assign_department(new_user.id, dept.id)
                dept_name = dept.name

        return EmployeeResponse(
            user_id=new_user.id,
            name=new_user.full_name,
            email=new_user.email,
            department=dept_name,
            role=data.role,
        )

    async def assign_employee_role(self, target_user_id: int, role: str, admin_user_id: int) -> UserRole:
        """Assign or modify the system role of a target user.

        Args:
            target_user_id (int): The employee to assign.
            role (str): Role designation.
            admin_user_id (int): Requesting administrator ID.

        Returns:
            UserRole: The updated role record mapping.

        Raises:
            ForbiddenException: If requestor is not an admin.
            NotFoundException: If the target user does not exist.
            AppException: If the role value is invalid.
        """
        is_admin = await self.check_is_admin(admin_user_id)
        if not is_admin:
            raise ForbiddenException("Only administrators can assign employee roles.")

        # Verify user exists
        user_result = await self.db.execute(select(User).where(User.id == target_user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User", target_user_id)

        # Validate role
        allowed_roles = {"Department Head", "Employee", "Asset Manager", "Admin"}
        if role not in allowed_roles:
            raise AppException(f"Invalid role '{role}'. Allowed roles: {list(allowed_roles)}", code="invalid_role")

        return await self.role_repo.assign_role(target_user_id, role)

    async def assign_employee_department(self, target_user_id: int, department_id: int, admin_user_id: int) -> UserDepartment:
        """Assign or modify the department of a target user.

        Args:
            target_user_id (int): The employee to assign.
            department_id (int): Associated Department ID.
            admin_user_id (int): Requesting administrator ID.

        Returns:
            UserDepartment: The updated department mapping record.

        Raises:
            ForbiddenException: If requestor is not an admin.
            NotFoundException: If the target user or department does not exist.
        """
        is_admin = await self.check_is_admin(admin_user_id)
        if not is_admin:
            raise ForbiddenException("Only administrators can assign departments to employees.")

        # Verify user exists
        user_result = await self.db.execute(select(User).where(User.id == target_user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User", target_user_id)

        # Verify department exists
        department = await self.dept_repo.get_by_id(department_id)
        if not department:
            raise NotFoundException("Department", department_id)

        return await self.user_dept_repo.assign_department(target_user_id, department_id)
