# backend/app/schemas/note.py
from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Status(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"

class NoteBase(BaseModel):
    title: str
    description: str | None = None
    priority: Priority = Priority.MEDIUM
    dueDate: datetime
    status: Status = Status.TODO  # Добавляем поле status

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    title: str | None = None
    dueDate: datetime | None = None
    priority: Priority | None = None
    status: Status | None = None  # Добавляем поле status для обновления

class NoteResponse(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    status: Status  # Добавляем поле status для ответа

    class Config:
        from_attributes = True