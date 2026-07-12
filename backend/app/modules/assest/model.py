from sqlalchemy import Boolean, Column, Integer, String, Text
from app.db.base import Base, TimestampMixin


class Assest(Base, TimestampMixin):

    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String(50), nullable=False, unique=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False, default="")
    status = Column(String(50), nullable=False, default="Available")
    current_holder = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    condition = Column(String(50), nullable=False, default="Good")
    is_active = Column(Boolean, nullable=False, default=True, index=True)

    def __repr__(self) -> str:
        return f"<Assest(id={self.id}, tag={self.tag!r}, name={self.name!r})>"
