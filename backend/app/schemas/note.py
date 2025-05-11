from pydantic import BaseModel, Field
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
    deadline: datetime = Field(..., alias="dueDate")
    status: Status = Status.TODO


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    deadline: datetime | None = Field(None, alias="dueDate")
    priority: Priority | None = None
    status: Status | None = None


class NoteResponse(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True
        populate_by_name = True
