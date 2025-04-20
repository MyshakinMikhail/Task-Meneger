from sqlalchemy import select
from app.models.user import user as user_table
from app.database.database import async_session
from app.utils.security import verify_password, get_password_hash

async def get_user_by_email(email: str):
    async with async_session() as session:
        stmt = select(user_table).where(user_table.c.email == email)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

async def create_user(username: str, email: str, password: str):
    hashed_password = get_password_hash(password)
    async with async_session() as session:
        stmt = user_table.insert().values(
            username=username,
            email=email,
            hashed_password=hashed_password
        )
        result = await session.execute(stmt)
        await session.commit()
        return {"id": result.lastrowid, "username": username, "email": email}

async def authenticate_user(email: str, password: str):
    user = await get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user