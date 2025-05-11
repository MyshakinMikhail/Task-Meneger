from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import (
    sessionmaker,
    declarative_base,
)  # Импортируем declarative_base
from .config import DATABASE_URL

engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()  # Определяем Base здесь


async def get_db():
    async with async_session() as session:
        yield session
