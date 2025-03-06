# Base image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Expose port
EXPOSE 5000

# Run with Gunicorn (production WSGI)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "core.app:create_app()"]
