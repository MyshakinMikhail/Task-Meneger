from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(16), index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    refresh_token = Column(String(512), nullable=True)