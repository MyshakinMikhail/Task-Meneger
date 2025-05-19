from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
from ..schemas.note import Priority, Status


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    title = Column(String, nullable=False)
    description = Column(String)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    deadline = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(Status), default=Status.TODO)

    user = relationship("User", back_populates="notes")
