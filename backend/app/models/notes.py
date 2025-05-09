from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base  # Импортируем Base
from .users import User
import enum

class Priority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    title = Column(String, nullable=False)
    description = Column(String)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    deadline = Column(DateTime(timezone=True), nullable=False)

    user = relationship("User", back_populates="notes")

