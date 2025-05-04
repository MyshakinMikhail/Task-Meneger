import aiosmtplib
from email.message import EmailMessage
from ..config import SMTP_USER, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT, DOMAIN

async def send_verification_email(email: str, token: str):
    message = EmailMessage()
    message["From"] = SMTP_USER
    message["To"] = email
    message["Subject"] = "Подтверждение регистрации на TaskHive"
    message.set_content(f"Перейдите по ссылке: {DOMAIN}/auth/verify-email/{token}")

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
        use_tls=True
    )