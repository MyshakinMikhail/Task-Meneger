from fastapi import APIRouter
from gigachat import GigaChat
from ..config import GIGACHAT_AUTH_TOKEN


router = APIRouter()

model = GigaChat(
    credentials=GIGACHAT_AUTH_TOKEN,
    scope="GIGACHAT_API_PERS",
    model="GigaChat",
    verify_ssl_certs=True,
    ca_bundle_file="/usr/local/share/ca-certificates/russian-trusted/russian_trusted_root_ca_pem.crt",
)


@router.get("/get-description")
async def generate_description(title: str):
    response = model.chat(
        f"Напиши краткое и простое описание задачи: {title}. Описание должно быть понятным, без сложных терминов и длинных предложений."
    )
    return {
        "message": "Description is ready",
        "description": f"{response.choices[0].message.content}",
    }
