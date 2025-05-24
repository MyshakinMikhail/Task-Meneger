import os
from dotenv import load_dotenv

load_dotenv()

# DOMAIN = "http://5.159.101.115"
DOMAIN = "http://localhost:5173"
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 465))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

GIGACHAT_AUTH_TOKEN = os.getenv("GIGACHAT_AUTH_TOKEN")
