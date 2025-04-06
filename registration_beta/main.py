from fastapi import FastAPI
from config import engine

import tables.users as user_tables
import routes.users as user_routes

# Создание таблиц в базе данных на основе моделей SQLAlchemy (если они еще не созданы).
user_tables.Base.metadata.create_all(bind=engine)
# Создание экземпляра приложения FastAPI.
app = FastAPI()

# Подключение роутера, содержащего эндпоинты для работы с пользователями.
app.include_router(user_routes.router, prefix="/api/v1/users")
print("User router included in app")
# Закомментированный пример корневого эндпоинта.
# @app.get("/")
# def read_root():
#     return {"Hello": "World"}