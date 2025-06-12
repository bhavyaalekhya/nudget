FROM python:3.10

# Set working directory
WORKDIR /app

# Copy app code from your folder into container
COPY "python-files/" /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose default Hugging Face port
EXPOSE 7860

# Run FastAPI app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
