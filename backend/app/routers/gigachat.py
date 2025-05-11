from fastapi import APIRouter

from gigachat import GigaChat

from ..config import GIGACHAT_AUTH_TOKEN

router = APIRouter()

model = GigaChat(
    credentials=GIGACHAT_AUTH_TOKEN,
    scope="GIGACHAT_API_PERS",
    model="GigaChat",
    ca_bundle_file="backend/cert/russian_trusted_root_ca.cer",
)


@router.get("/get_description")
async def generate_description(name: str):
    response = model.chat(
        f"Напиши краткое и простое описание задачи: {name}. Описание должно быть понятным, без сложных терминов и длинных предложений."
    )
    return {
        "message": "Description is ready",
        "response": f"{response.choices[0].message.content}",
    }
