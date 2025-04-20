from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    username: str = Field(min_length=8, max_length=16, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    password: str = Field(min_length=8, max_length=32, pattern=r"^[a-zA-Z0-9@#$%^&+=]+$")

class UserLogin(BaseModel):
    username: str = Field(min_length=8, max_length=16, pattern=r"^[a-zA-Z0-9_]+$")
    password: str = Field(min_length=8, max_length=32, pattern=r"^[a-zA-Z0-9@#$%^&+=]+$")

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    class Config:
        orm_mode = True