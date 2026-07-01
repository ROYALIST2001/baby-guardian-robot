# Bring in FastAPI, the tool we use to build our Python web server.
from fastapi import FastAPI

# Create the application object.
app = FastAPI()

# Define a health check endpoint, just like we did in Node.
# When someone visits "/health", FastAPI automatically turns this
# dictionary into a JSON reply for us.
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "python-ai-backend"}