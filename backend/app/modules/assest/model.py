from sqlalchemy import Boolean, Column, Integer, String, Text
from app.db.base import Base, TimestampMixin


class Assest(Base, TimestampMixin):
    __tablename__ = "assests"

    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String(50), nullable=False, unique=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False, default="")
    status = Column(String(50), nullable=False, default="Available")
    current_holder = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    condition = Column(String(50), nullable=False, default="Good")
    is_active = Column(Boolean, nullable=False, default=True, index=True)

    # Asset Manager Extended Fields
    category = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    brand = Column(String(255), nullable=True)
    model = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    manufacturer = Column(String(255), nullable=True)
    purchase_date = Column(String(50), nullable=True)
    warranty_expiry = Column(String(50), nullable=True)
    cost = Column(String(50), nullable=True)
    supplier = Column(String(255), nullable=True)
    is_shared = Column(Boolean, nullable=False, default=False)
    is_bookable = Column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Assest(id={self.id}, tag={self.tag!r}, name={self.name!r})>"
