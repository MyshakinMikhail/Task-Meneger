from fastapi import APIRouter, Depends, HTTPException, Cookie
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..schemas.user import UserRegister, UserLogin, Token
from ..models.users import User
from ..security.security import *
from ..database import get_db
from ..config import REFRESH_TOKEN_EXPIRE_DAYS
from ..services.email import send_verification_email

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    existing_user = await db.execute(select(User).filter(User.email == user_data.email))
    if existing_user.scalars().first():
        raise HTTPException(status_code=409, detail="Почта уже зарегестрирована")

    hashed_password = get_password_hash(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
    )

    verification_token = create_email_verification_token(user.email)
    user.verification_token = verification_token
    user.token_expiration = datetime.now(timezone.utc) + timedelta(hours=24)
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    await send_verification_email(user.email, verification_token)

    return JSONResponse(
        content={"message": "Письмо с подтверждением отправлено на вашу почту"},
        status_code=201
    )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await db.execute(select(User).filter(User.email == user_data.email))
    user = user.scalars().first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверная почта или пароль",)
    
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Подтвердите вашу почту")


    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})

    user.refresh_token = refresh_token
    await db.commit()
    await db.refresh(user)

    response = JSONResponse(
        content={"access_token": access_token, "token_type": "bearer"}
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        secure=True,
        samesite="Lax",
    )
    return response


@router.post("/refresh")
async def refresh_token(
    db: AsyncSession = Depends(get_db), refresh_token: str = Cookie(None)
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token утерян")

    payload = decode_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Неверный refresh token")

    user = await db.execute(select(User).filter(User.email == payload.get("sub")))
    user = user.scalars().first()
    if not user or user.refresh_token != refresh_token:
        raise HTTPException(status_code=401, detail="Неверный refresh token")

    new_access_token = create_access_token(data={"sub": user.email})
    new_refresh_token = create_refresh_token({"sub": user.email})

    user.refresh_token = new_refresh_token
    await db.commit()
    await db.refresh(user)

    response = JSONResponse(
        content={"access_token": new_access_token, "token_type": "bearer"}
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        secure=True,
        samesite="Lax",
    )
    return response


@router.post("/logout")
async def logout(db: AsyncSession = Depends(get_db), refresh_token: str = Cookie(None)):
    if refresh_token:
        payload = decode_token(refresh_token)
        if payload:
            user = await db.execute(
                select(User).filter(User.email == payload.get("sub"))
            )
            user = user.scalars().first()
            if user:
                user.refresh_token = None
                await db.commit()
                await db.refresh(user)

    response = JSONResponse(content={"message": "Successfully logged out"})
    response.delete_cookie("refresh_token")
    return response

@router.get("/verify-email/{token}")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    email = verify_email_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Недействительный токен")
    
    user = await db.execute(select(User).filter(User.email == email))
    user = user.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    if user.is_verified:
        return {"message": "Почта уже подтверждена"}
    
    if datetime.now(timezone.utc) > user.token_expiration:
        raise HTTPException(status_code=400, detail="Срок действия токена истёк")
    
    user.is_verified = True
    user.verification_token = None
    await db.commit()
    
    return {"message": "Почта успешно подтверждена"}