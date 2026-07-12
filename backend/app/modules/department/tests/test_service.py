"""Unit tests for the DepartmentService.

Tests authorization clearances, department creation constraints,
categories, locations, and employee role assignment logic.
"""

from unittest.mock import AsyncMock, MagicMock
import pytest
from app.modules.department.service import DepartmentService
from app.modules.department.schema import DepartmentCreate, AssetCategoryCreate, LocationCreate, EmployeeCreate
from app.modules.signup.model import User
from app.modules.department.model import Department
from app.common.exceptions import ForbiddenException, ConflictException, NotFoundException


class TestDepartmentService:
    """Test suite containing unit tests for the DepartmentService class."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        """Fixture providing an AsyncMock for the database session.

        Returns:
            AsyncMock: Mocked DB session.
        """
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> DepartmentService:
        """Fixture providing a DepartmentService instance.

        Args:
            mock_db (AsyncMock): Mocked DB session.

        Returns:
            DepartmentService: Configured service.
        """
        return DepartmentService(mock_db)

    async def test_check_is_admin_email_fallback(self, service: DepartmentService) -> None:
        """Verify that a user with 'admin' in their email passes authorization checks.

        Args:
            service (DepartmentService): The department service instance.
        """
        mock_user = MagicMock(spec=User)
        mock_user.email = "admin@assetflow.com"
        
        mock_execute = MagicMock()
        mock_execute.scalar_one_or_none.return_value = mock_user
        service.db.execute = AsyncMock(return_value=mock_execute)

        is_admin = await service.check_is_admin(user_id=1)
        assert is_admin is True

    async def test_check_is_admin_non_admin_fails(self, service: DepartmentService) -> None:
        """Verify that a normal user email fails the admin authorization check.

        Args:
            service (DepartmentService): The department service instance.
        """
        mock_user = MagicMock(spec=User)
        mock_user.email = "employee@assetflow.com"
        
        mock_execute = MagicMock()
        mock_execute.scalar_one_or_none.return_value = mock_user
        service.db.execute = AsyncMock(return_value=mock_execute)
        service.role_repo.get_role_by_user_id = AsyncMock(return_value=None)

        is_admin = await service.check_is_admin(user_id=2)
        assert is_admin is False

    async def test_create_department_unauthorized(self, service: DepartmentService) -> None:
        """Verify that a non-admin user cannot register a new department.

        Args:
            service (DepartmentService): The department service instance.
        """
        service.check_is_admin = AsyncMock(return_value=False)
        data = DepartmentCreate(name="IT Infra", head="Alex", parent="Tech")

        with pytest.raises(ForbiddenException):
            await service.create_department(data, user_id=2)

    async def test_create_department_duplicate_name(self, service: DepartmentService) -> None:
        """Verify that creating a department with a duplicate name raises ConflictException.

        Args:
            service (DepartmentService): The department service instance.
        """
        service.check_is_admin = AsyncMock(return_value=True)
        service.dept_repo.get_by_name = AsyncMock(return_value=MagicMock())
        data = DepartmentCreate(name="IT Infra", head="Alex", parent="Tech")

        with pytest.raises(ConflictException):
            await service.create_department(data, user_id=1)

    async def test_create_category_success(self, service: DepartmentService) -> None:
        """Verify successful category registration for admin users.

        Args:
            service (DepartmentService): The department service instance.
        """
        service.check_is_admin = AsyncMock(return_value=True)
        service.cat_repo.get_by_name = AsyncMock(return_value=None)
        
        mock_category = MagicMock()
        mock_category.name = "Electronics"
        service.cat_repo.create = AsyncMock(return_value=mock_category)

        data = AssetCategoryCreate(name="Electronics", description="Laptops")
        result = await service.create_category(data, user_id=1)

        assert result.name == "Electronics"
        service.cat_repo.create.assert_called_once_with(name="Electronics", description="Laptops")

    async def test_create_location_success(self, service: DepartmentService) -> None:
        """Verify successful location registration for admin users.

        Args:
            service (DepartmentService): The department service instance.
        """
        service.check_is_admin = AsyncMock(return_value=True)
        service.loc_repo.get_by_name = AsyncMock(return_value=None)
        
        mock_location = MagicMock()
        mock_location.name = "Main HQ"
        service.loc_repo.create = AsyncMock(return_value=mock_location)

        data = LocationCreate(name="Main HQ", type="Office", capacity=150)
        result = await service.create_location(data, user_id=1)

        assert result.name == "Main HQ"
        service.loc_repo.create.assert_called_once_with(
            name="Main HQ", type="Office", capacity=150, status="Active"
        )

    async def test_assign_employee_role_unauthorized(self, service: DepartmentService) -> None:
        """Verify non-admin users cannot assign employee system roles.

        Args:
            service (DepartmentService): The department service instance.
        """
        service.check_is_admin = AsyncMock(return_value=False)
        with pytest.raises(ForbiddenException):
            await service.assign_employee_role(target_user_id=2, role="Asset Manager", admin_user_id=3)

    async def test_assign_employee_department_not_found(self, service: DepartmentService) -> None:
        """Verify that assigning a non-existent department raises NotFoundException.

        Args:
            service (DepartmentService): The department service instance.
        """
        service.check_is_admin = AsyncMock(return_value=True)
        
        mock_user = MagicMock(spec=User)
        mock_execute = MagicMock()
        mock_execute.scalar_one_or_none.return_value = mock_user
        service.db.execute = AsyncMock(return_value=mock_execute)
        
        service.dept_repo.get_by_id = AsyncMock(return_value=None)

        with pytest.raises(NotFoundException):
            await service.assign_employee_department(target_user_id=2, department_id=999, admin_user_id=1)

    async def test_register_employee_unauthorized(self, service: DepartmentService) -> None:
        """Verify that a non-admin user cannot register an employee.

        Args:
            service (DepartmentService): The department service instance.
        """
        service.check_is_admin = AsyncMock(return_value=False)
        data = EmployeeCreate(name="Mike Ross", email="mike@example.com", department="Legal", role="Employee")

        with pytest.raises(ForbiddenException):
            await service.register_employee(data, admin_user_id=2)

    async def test_register_employee_success(self, service: DepartmentService) -> None:
        """Verify successful employee registration by an administrator.

        Args:
            service (DepartmentService): The department service instance.
        """
        service.check_is_admin = AsyncMock(return_value=True)
        
        # Mock email check
        mock_execute = MagicMock()
        mock_execute.scalar_one_or_none.return_value = None
        service.db.execute = AsyncMock(return_value=mock_execute)

        async def mock_refresh(instance):
            instance.id = 1
        service.db.refresh = mock_refresh

        service.role_repo.assign_role = AsyncMock()
        service.dept_repo.get_by_name = AsyncMock(return_value=None)

        data = EmployeeCreate(name="Mike Ross", email="mike@example.com", department="Legal", role="Employee")
        result = await service.register_employee(data, admin_user_id=1)

        assert result.name == "Mike Ross"
        assert result.email == "mike@example.com"
        assert result.role == "Employee"
        service.role_repo.assign_role.assert_called_once()
