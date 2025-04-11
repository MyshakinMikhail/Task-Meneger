from fastapi import APIRouter, Depends, HTTPException, status
from models.users import ResponseSchema, TokenResponse, Login, Register
from sqlalchemy.orm import Session
from config import get_db
from passlib.context import CryptContext
from repository.users import UsersRepo, JWTRepo
from tables.users import Users
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

print("Routes/users.py loaded")
router = APIRouter(
    tags={"Authentication"}
)

# Конфигурация для работы с хешированием паролей (bcrypt).
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Эндпоинт для регистрации нового пользователя.
@router.post("/signup")
async def signup(request: Register, db: Session = Depends(get_db)):
    try:
        # Проверяем, существует ли пользователь с таким email.
        existing_user_by_email = db.query(Users).filter(Users.email == request.email).first()
        if existing_user_by_email:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Пользователь с таким email уже существует.")

        # Создаем нового пользователя и сохраняем в базе данных.
        _user = Users(
            email=request.email,
            password=pwd_context.hash(request.password),
            username=request.username
        )
        UsersRepo.insert(db, _user)
        return ResponseSchema(
            code="200",
            status="success",
            message="User created successfully",
            result={"id": _user.id, "email": _user.email}
        ).dict(exclude_none=True)

    # Обработка ошибок валидации входных данных.
    except ValidationError as error:
        print(f"Ошибка валидации перехвачена: {error}")
        print(f"Детали ошибки валидации: {error.errors()}")
        error_details = ", ".join([f"{err['loc'][1]}: {err['msg']}" for err in error.errors()])
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Ошибка валидации: {error_details}"
        )
    # Обработка HTTP исключений, выброшенных в коде.
    except HTTPException as error:
        print(f"HTTPException перехвачена: {error}")
        raise error
    # Обработка ошибок целостности базы данных (например, нарушение уникальности email).
    except IntegrityError as error:
        print(f"Ошибка целостности базы данных: {error}")
        db.rollback()
        if "ix_users_email" in str(error):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Пользователь с таким email уже существует.")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Ошибка при создании пользователя.")
    # Обработка всех остальных исключений.
    except Exception as error:
        print(f"Ошибка сервера при регистрации: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка на сервере. Попробуйте позже."
        )

# Эндпоинт для логина пользователя.
@router.post("/login")
async def login(request: Login, db: Session = Depends(get_db)):
    try:
        # Проверяем, существует ли пользователь с таким email.
        user = UsersRepo.find_by_email(db, Users, request.email)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

        # Проверяем пароль.
        if not pwd_context.verify(request.password, user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный пароль")

        # Генерируем JWT токен.
        token = JWTRepo.generate_token({"sub": user.email})
        return TokenResponse(
            access_token=token,
            token_type="bearer"
        ).dict(exclude_none=True)

    # Обработка HTTP исключений.
    except HTTPException as error:
        print(f"HTTPException перехвачена в login: {error}")
        raise error
    # Обработка всех остальных исключений.
    except Exception as error:
        print(f"Ошибка сервера при логине: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка на сервере. Попробуйте позже."
        )