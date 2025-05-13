from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    refresh_token = Column(String(512), nullable=True)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(512), nullable=True)
    token_expiration = Column(DateTime(timezone=True), nullable=True)

    notes = relationship("Note", back_populates="user")
