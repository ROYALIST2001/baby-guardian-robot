# FILE: app/services/health_service.py
# JOB: The logic for the health check.

def get_health_status():
    # Return a simple dictionary. FastAPI will turn it into JSON.
    return {
        "status": "ok",
        "service": "python-ai-backend",
        "message": "Python backend is running with layers"
    }