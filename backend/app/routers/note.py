from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from sqlalchemy.orm import joinedload

from ..database import get_db
from ..models.notes import Note
from ..schemas.note import NoteCreate, NoteUpdate, NoteResponse
from ..schemas.user import UserResponse
from ..security.security import get_current_user
from ..models.users import User

router = APIRouter(prefix="/tasks", tags=["Задачи"])


@router.post(
    "/create-task", response_model=NoteResponse, status_code=status.HTTP_201_CREATED
)
async def create_task(
    note: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    print("USER - {current_user}")
    db_note = Note(**note.model_dump(), user_id=current_user.id)
    db.add(db_note)
    await db.commit()
    await db.refresh(db_note)
    return db_note


@router.put("/edit-task/{note_id}", response_model=NoteResponse)
async def edit_task(
    note_id: int,
    note_update: NoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # async with db.begin():
    existing_note = await db.execute(
        select(Note).where(Note.id == note_id, Note.user_id == current_user.id)
    )
    db_note = existing_note.scalar_one_or_none()

    if db_note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заметка не найдена"
        )

    update_data = note_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_note, key, value)

    await db.commit()
    await db.refresh(db_note)
    return db_note


@router.delete("/delete-task/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # async with db.begin():
    result = await db.execute(
        delete(Note).where(Note.id == note_id, Note.user_id == current_user.id)
    )
    deleted_count = result.rowcount
    await db.commit()

    if deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заметка не найдена"
        )
    return


@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    user = await db.execute(
        select(User).where(User.id == current_user.id).options(joinedload(User.notes))
    )
    current_user_with_notes = user.unique().scalar_one()
    return current_user_with_notes
