from contextlib import asynccontextmanager
from fastapi.exceptions import RequestValidationError
from fastapi import FastAPI, HTTPException, Request
from .routers import auth
from .database import engine
from .models.users import Base, User

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/", tags=["Главная"])
async def root():
    return {"message": "FastAPI auth app is running!"}

app.include_router(auth.router, prefix="/auth", tags=["Аутентификация"])

@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError):
    error_message = exc.errors()[0]["msg"][13:]
    raise HTTPException(status_code=422, detail=error_message)