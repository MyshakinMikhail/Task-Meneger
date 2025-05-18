# Используем официальный образ Python
FROM python:3.13-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости первыми для кэширования
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Обновление сертификатов для GigaChat
RUN mkdir /usr/local/share/ca-certificates/russian-trusted
COPY cert/russian_trusted_root_ca_pem.crt cert/russian_trusted_sub_ca_pem.crt /usr/local/share/ca-certificates/russian-trusted
RUN update-ca-certificates -v

# Копируем исходный код
COPY ./app ./app

# Открываем порт, на котором работает FastAPI
EXPOSE 8000

# Запускаем сервер
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
