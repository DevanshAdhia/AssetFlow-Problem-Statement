"""Database models for organization department structure, categories, locations, and roles.

Contains the SQLAlchemy Department, UserRole, AssetCategory, Location, and
UserDepartment mappings.
"""

from sqlalchemy import Column, Integer, String
from app.db.base import Base, TimestampMixin


class Department(Base, TimestampMixin):
    """SQLAlchemy model representing an organizational department.

    Attributes:
        id (int): Primary key ID.
        name (str): Unique department name, e.g. 'IT Infrastructure'.
        head (str, optional): Name of the department lead.
        parent (str, optional): Name of parent department.
        status (str): Current status of the department, e.g. 'Active'.
    """

    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    head = Column(String(255), nullable=True)
    parent = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False, default="Active")

    def __repr__(self) -> str:
        """Return representation string for the Department model.

        Returns:
            str: Formal representation of the department instance.
        """
        return f"<Department(id={self.id}, name={self.name!r})>"


class UserRole(Base, TimestampMixin):
    """SQLAlchemy model mapping user IDs to their custom system access role.

    Used to check user clearance without modifying the original User model schema.

    Attributes:
        id (int): Primary key ID.
        user_id (int): Unique identifier of the User.
        role (str): Authorized role, e.g. 'Department Head', 'Asset Manager'.
    """

    __tablename__ = "user_roles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True, index=True)
    role = Column(String(50), nullable=False, default="Employee")

    def __repr__(self) -> str:
        """Return representation string for the UserRole model.

        Returns:
            str: Formal representation of the user role mapping.
        """
        return f"<UserRole(user_id={self.user_id}, role={self.role!r})>"


class AssetCategory(Base, TimestampMixin):
    """SQLAlchemy model representing a master classification category for assets.

    Attributes:
        id (int): Primary key ID.
        name (str): Unique category name, e.g. 'Electronics'.
        description (str, optional): Summary description of items inside category.
    """

    __tablename__ = "asset_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(String(1000), nullable=True)

    def __repr__(self) -> str:
        """Return representation string for the AssetCategory model.

        Returns:
            str: Formal representation of the category.
        """
        return f"<AssetCategory(id={self.id}, name={self.name!r})>"


class Location(Base, TimestampMixin):
    """SQLAlchemy model representing a physical/logical building or storage area.

    Attributes:
        id (int): Primary key ID.
        name (str): Unique location name, e.g. 'Main HQ - Floor 1'.
        type (str): Type of facility, e.g. 'Office', 'Data Center', 'Storage'.
        capacity (int): Maximum estimated capacity of physical assets.
        status (str): Current status of the location, e.g. 'Active'.
    """

    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    type = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False, default=0)
    status = Column(String(50), nullable=False, default="Active")

    def __repr__(self) -> str:
        """Return representation string for the Location model.

        Returns:
            str: Formal representation of the location.
        """
        return f"<Location(id={self.id}, name={self.name!r})>"


class UserDepartment(Base, TimestampMixin):
    """SQLAlchemy model mapping a User to a specific organizational Department.

    Attributes:
        id (int): Primary key ID.
        user_id (int): Unique identifier of the User.
        department_id (int): Associated Department ID.
    """

    __tablename__ = "user_departments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True, index=True)
    department_id = Column(Integer, nullable=False, index=True)

    def __repr__(self) -> str:
        """Return representation string for the UserDepartment model.

        Returns:
            str: Formal representation of the department association.
        """
        return f"<UserDepartment(user_id={self.user_id}, department_id={self.department_id})>"
