# Используем официальный образ Python
FROM python:3.13-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости первыми для кэширования
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY ./app ./app

# Открываем порт, на котором работает FastAPI
EXPOSE 8000

# Запускаем сервер
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]