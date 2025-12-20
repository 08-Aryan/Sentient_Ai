FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for potential compilations (psycopg2)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port Flask runs on
EXPOSE 5001

# Production command using Gunicorn
CMD ["gunicorn", "--config", "gunicorn.conf.py", "app:app"]
