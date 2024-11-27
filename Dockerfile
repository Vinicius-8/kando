# Base image
FROM python:3.9-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo de dependências para o contêiner
COPY requirements.txt .

# Instala dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código para o diretório do app no contêiner
COPY . .

# Define variáveis de ambiente para produção
ENV PYTHONUNBUFFERED=1

# Coleta os arquivos estáticos para o diretório 'staticfiles'
RUN python manage.py collectstatic --noinput

# Expõe a porta 8000
EXPOSE 8000

# Comando para iniciar o Gunicorn no modo produção
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "kando.wsgi:application"]
