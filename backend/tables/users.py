from sqlalchemy import Column, Integer, String
from config import Base

# Определение таблицы 'users' в базе данных.
class Users(Base):
    __tablename__ = "users"

    # Уникальный идентификатор пользователя (целое число, первичный ключ, индексирован).
    id = Column(Integer, primary_key=True, index=True)
    # Email пользователя (строка, уникальный, индексирован).
    email = Column(String, unique=True, index=True)
    # Хешированный пароль пользователя (строка).
    password = Column(String)
    # Имя пользователя (строка, уникальный, индексирован).
    username = Column(String, unique=True, index=True) # Добавлен столбец username

    # Метод для строкового представления объекта User.
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"