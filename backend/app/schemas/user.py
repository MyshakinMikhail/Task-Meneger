from pydantic import BaseModel, field_validator
import re
from typing import Optional, List
from .note import NoteResponse


def validate_password(v: str) -> str:
    if len(v) < 8 or len(v) > 32:
        raise ValueError("Пароль должен содержать от 8 до 32 символов")
    if not re.match(r"^[a-zA-Z0-9!@#$%^&*()_+]+$", v):
        raise ValueError(
            "Пароль содержит недопустимые символы.\nДопустимые символы: (a-z)(A-Z)(0-9)!@#$%^&*()_+"
        )
    return v


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

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.fullmatch(
            r"^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$",
            v,
        ):
            raise ValueError("Неверный формат email")
        local_part, domain = v.split("@")
        if len(local_part) > 64:
            raise ValueError("Локальная часть email не должна превышать 64 символа")
        if len(domain) > 255:
            raise ValueError("Домен не должен превышать 255 символов")
        return v

    @field_validator("password")
    @classmethod
    def validate_form(cls, v: str) -> str:
        return validate_password(v)


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
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True


class UserResetPassword(BaseModel):
    password: str

    @field_validator("password")
    @classmethod
    def validate_form(cls, v: str) -> str:
        return validate_password(v)


class UserOnlyEmail(BaseModel):
    email: str
