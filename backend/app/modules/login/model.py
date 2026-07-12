from sqlalchemy import Boolean, Column, Integer, String, Text
from app.db.base import Base, TimestampMixin


class Login(Base, TimestampMixin):
    __tablename__ = "logins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False, default="")
    is_active = Column(Boolean, nullable=False, default=True, index=True)

    def __repr__(self) -> str:
        return f"<Login(id={self.id}, name={self.name!r})>"
