from fastapi import HTTPException
from pydantic import BaseModel, field_validator
import re
from typing import Optional, List
from datetime import datetime

from .note import NoteResponse  # Импортируем NoteResponse

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if len(v) < 3 or len(v) > 50:
            raise ValueError("Никнейм должен содержать от 3 до 50 символов")
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError(
                "Никнейм должен содержать только латинские буквы, цифры и нижние подчеркивание"
            )
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if "@" not in v or "." not in v:
            raise ValueError("Некорректный формат почты")
        if len(v) > 255:
            raise ValueError("Максимальная длина почты - 255 символов")
        return v

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8 or len(v) > 32:
            raise ValueError('Пароль должен содержать от 8 до 32 символов')
        if not re.match(r'^[a-zA-Z0-9!@#$%^&*()_+]+$', v):
            raise ValueError('Пароль содержит недопустимые символы.\nДопустимые символы: a-zA-Z0-9!@#$%^&*()_+')
        return v


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    notes: List[NoteResponse] = []  # Список заметок пользователя

    class Config:
        from_attributes = True