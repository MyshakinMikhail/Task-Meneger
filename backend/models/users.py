from typing import Generic, Optional, TypeVar
from pydantic import BaseModel, Field, EmailStr, validator

T = TypeVar("T")

# Модель Pydantic для данных, получаемых при запросе на логин.
class Login(BaseModel):
    email: str = Field(..., min_length=3, max_length=50, format="email")
    password: str = Field(..., min_length=8, max_length=20)

# Модель Pydantic для данных, получаемых при запросе на регистрацию.
class Register(BaseModel):
    id: Optional[int] = None
    email: EmailStr = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=20)
    username: str = Field(..., min_length=3, max_length=50) # Добавлено поле username

    # Кастомный валидатор для проверки сложности пароля.
    @validator("password")
    def check_password_complexity(cls, value):
        has_upper = any(c.isupper() for c in value)
        has_lower = any(c.islower() for c in value)
        has_digit = any(c.isdigit() for c in value)
        has_special = any(c in "@$!%*?&" for c in value)

        if not (has_upper and has_lower and has_digit and has_special):
            raise ValueError(
                "Пароль должен содержать как минимум одну букву в верхнем регистре, "
                "одну букву в нижнем регистре, одну цифру и один специальный символ (@$!%*?&)."
            )
        return value

# Модель Pydantic для структуры ответа API.
class ResponseSchema(BaseModel):
    code: str = Field(..., min_length=3, max_length=50)
    status: str = Field(..., min_length=3, max_length=50)
    message: str = Field(..., min_length=3, max_length=50)
    result: Optional[T] = None

# Модель Pydantic для структуры ответа с JWT токеном.
class TokenResponse(BaseModel):
    access_token: str
    token_type: str