from pydantic import BaseModel, EmailStr, field_validator
import re


class UserRegister(BaseModel):
    username: str
    email: EmailStr
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

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8 or len(v) > 32:
            raise ValueError("Пароль должен содержать от 8 до 32 символов")
        if not re.match(r"^[a-zA-Z0-9!@#$%^&*()_+]+$", v):
            raise ValueError(
                "Пароль содержит недопустимые символы."
                "Допустимые символы: a-zA-Z0-9!@#$%^&*()_+"
            )
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
