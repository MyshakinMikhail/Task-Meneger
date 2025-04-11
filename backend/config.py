from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL для подключения к базе данных PostgreSQL.
DATABASE_URL = "postgresql://postgres:4426@localhost:5432/users_db"
# Создание движка SQLAlchemy для взаимодействия с базой данных.
engine = create_engine(DATABASE_URL)
# Создание фабрики сессий SQLAlchemy для управления сессиями подключения к БД.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Базовый класс для декларативных моделей SQLAlchemy.
Base = declarative_base()

# Функция-зависимость FastAPI для получения сессии базы данных.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Настройки для работы с JWT (JSON Web Tokens).
SECRET_KEY="bigblackkerbal" # Секретный ключ для подписи и проверки токенов.
ALGORITHM="HS256" # Алгоритм шифрования JWT.
ACCESS_TOKEN_EXPIRE_MINUTES=30 # Время жизни access токена в минутах.