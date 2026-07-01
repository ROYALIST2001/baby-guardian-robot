# Start from an official box that already has Python 3.11 inside.
FROM python:3.11

# Set the working folder inside the box.
WORKDIR /app

# Copy the requirements list first (same caching trick as before).
COPY requirements.txt .

# Install the Python libraries (FastAPI and uvicorn).
RUN pip install -r requirements.txt

# Copy the rest of our code in.
COPY . .

# Tell Docker our app uses port 8000.
EXPOSE 8000

# When the box starts, run our app with uvicorn.
# "main:app" means: in the file main.py, use the variable called "app".
# "--host 0.0.0.0" means: accept visitors from outside the box (important!).
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]