from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class NoteBase(BaseModel):
    title: str
    description: str | None = None
    priority: Priority = Priority.MEDIUM
    dueDate: datetime

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    title: str | None = None
    dueDate: datetime | None = None
    priority: Priority | None = None

class NoteResponse(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True