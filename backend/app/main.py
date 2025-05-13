from contextlib import asynccontextmanager
from fastapi.exceptions import RequestValidationError
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, note, gigachat
from .database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Главная"])
async def root():
    return {"message": "FastAPI auth app is running!"}


app.include_router(auth.router, prefix="/auth", tags=["Аутентификация"])
app.include_router(note.router, prefix="/tasks", tags=["Задачи"])
app.include_router(gigachat.router, prefix="/gigachat", tags=["ГигаЧат"])


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError):
    error_message = exc.errors()[0]["msg"][13:]
    raise HTTPException(status_code=422, detail=error_message)
