from sqlalchemy import Table, Column, Integer, String
from app.database.database import metadata

user = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("username", String(16), unique=True, index=True),
    Column("email", String, unique=True, index=True),
    Column("hashed_password", String)
)