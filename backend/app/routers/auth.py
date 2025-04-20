from fastapi import APIRouter, HTTPException, status, Response, Depends
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.schemas.token import Token
from app.database.user import create_user, authenticate_user, get_user_by_email
from app.database.token import create_refresh_token as db_create_rt, revoke_refresh_token, get_refresh_token
from app.utils.security import create_access_token, create_refresh_token as gen_refresh, decode_token
from app.config import REFRESH_TOKEN_EXPIRE_DAYS
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserCreate):
    if await get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    if await authenticate_user(user.username, user.password):
        raise HTTPException(status_code=400, detail="Username уже существует")
    return await create_user(user.username, user.email, user.password)

@router.post("/login")
async def login(response: Response, creds: UserLogin):
    user = await authenticate_user(creds.username, creds.password)
    if not user:
        raise HTTPException(status_code=400, detail="Неверные учетные данные")
    access_token = create_access_token(subject=user.username)
    refresh_str, expires = gen_refresh()
    await db_create_rt(user_id=user.id, token=refresh_str, expires_at=expires)
    response.set_cookie(
        key="refresh_token",
        value=refresh_str,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600
    )
    return {"access_token": access_token}

@router.post("/refresh")
async def refresh(response: Response, refresh_token: str = Depends(lambda request: request.cookies.get("refresh_token"))):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    db_token = await get_refresh_token(refresh_token)
    if not db_token or db_token.revoked or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    await revoke_refresh_token(refresh_token)
    access_token = create_access_token(subject=db_token.user_id)
    new_str, expires = gen_refresh()
    await db_create_rt(user_id=db_token.user_id, token=new_str, expires_at=expires)
    response.set_cookie(
        key="refresh_token",
        value=new_str,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600
    )
    return {"access_token": access_token}

@router.post("/logout")
async def logout(response: Response, refresh_token: str = Depends(lambda request: request.cookies.get("refresh_token"))):
    if refresh_token:
        await revoke_refresh_token(refresh_token)
    response.delete_cookie(key="refresh_token")
    return {"detail": "Logged out"}