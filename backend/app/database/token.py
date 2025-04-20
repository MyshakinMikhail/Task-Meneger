from sqlalchemy import select
from datetime import datetime
from app.models.token import refresh_token as token_table
from app.database.database import async_session

async def create_refresh_token(user_id: int, token: str, expires_at: datetime):
    async with async_session() as session:
        stmt = token_table.insert().values(
            user_id=user_id,
            token=token,
            expires_at=expires_at,
            revoked=False
        )
        await session.execute(stmt)
        await session.commit()

async def revoke_refresh_token(token: str):
    async with async_session() as session:
        stmt = token_table.update().where(token_table.c.token == token).values(revoked=True)
        await session.execute(stmt)
        await session.commit()

async def get_refresh_token(token: str):
    async with async_session() as session:
        stmt = select(token_table).where(token_table.c.token == token)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()