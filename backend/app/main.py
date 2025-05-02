from contextlib import asynccontextmanager
from fastapi import FastAPI
from .routers import auth
from .database import engine
from .models.users import Base, User
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(auth.router, prefix="/auth", tags=["Аутентификация"])

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
