FROM python:3.13-alpine

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir /usr/local/share/ca-certificates/russian-trusted
COPY cert/russian_trusted_root_ca_pem.crt cert/russian_trusted_sub_ca_pem.crt /usr/local/share/ca-certificates/russian-trusted/
RUN update-ca-certificates -v

COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
