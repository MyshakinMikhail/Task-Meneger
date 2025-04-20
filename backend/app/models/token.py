from sqlalchemy import Table, Column, Integer, String, Boolean, DateTime, ForeignKey
from app.database.database import metadata

refresh_token = Table(
    "refresh_tokens",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("token", String, unique=True, index=True),
    Column("expires_at", DateTime),
    Column("revoked", Boolean, default=False)
)