import asyncio
from fastapi import FastAPI
from app.database.database import engine, metadata
from app.routers.auth import router as auth_router

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(metadata.create_all)

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await init_models()

@app.on_event("shutdown")
async def on_shutdown():
    await engine.dispose()

app.include_router(auth_router)