from typing import TypeVar, Generic, Optional
from sqlalchemy.orm import Session

from jose import JWTError, jwt
from config import SECRET_KEY, ALGORITHM
from datetime import datetime, timedelta

from fastapi import Depends, Request, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

T = TypeVar("T")

# Базовый класс для репозиториев, предоставляет общие методы для работы с БД.
class BaseRepo():

    @staticmethod
    def insert(db: Session, model: Generic[T]):
        db.add(model)
        db.commit()
        db.refresh(model)
        return model

# Репозиторий для работы с моделью User (таблица users).
class UsersRepo(BaseRepo):

    @staticmethod
    def find_by_email(db: Session, model: Generic[T], email: str): # Переименовали метод
        return db.query(model).filter(model.email == email).first() # Ищем по email

# Класс для работы с JWT токенами (генерация и декодирование).
class JWTRepo():
    def generate_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
            to_encode.update({"exp": expire})
            encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
            return encoded_jwt

    def decode_token(token: str):
        try:
            decode_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return decode_token if decode_token["exp"] >= datetime.utcnow() else None
        except:
            return{}