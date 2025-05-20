from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import JSONResponse
from sqlalchemy import select
from datetime import datetime, timedelta, timezone

from ..security.security import (
    get_password_hash,
    create_email_verification_token,
    verify_email_token,
)
from ..services.email import send_password_email
from ..schemas.user import UserResetPassword, UserOnlyEmail
from ..models.users import User
from ..database import get_db

router = APIRouter()


@router.post("/send-message")
async def send_reset_password_email(
    data: UserOnlyEmail, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).filter(User.email == data.email))
    user: User | None = result.scalar().first()
    if not user:
        raise HTTPException(
            status_code=404, detail="Пользователь с таким Email не найден"
        )

    verification_token = create_email_verification_token(user.email)
    user.verification_token = verification_token
    user.token_expiration = datetime.now(timezone.utc) + timedelta(hours=24)

    db.add(user)
    await db.commit()

    await send_password_email(email=user.email, token=verification_token)
    return JSONResponse(
        content={"message": "Сообщение отправлено на почту"},
        status_code=200,
    )


@router.post("/change-password/{token}")
async def change_password(
    token: str, data_for_reset: UserResetPassword, db: AsyncSession = Depends(get_db)
):
    email = verify_email_token(token)
    user: User = await db.scalar(select(User).where(User.email == email))
    hashed_password = get_password_hash(data_for_reset.password)
    user.hashed_password = hashed_password
    db.add(user)
    await db.commit()
    return JSONResponse(
        content={"message": "Пароль успешно сменён"},
        status_code=200,
    )
