# FILE: app/controllers/health_controller.py
# JOB: Call the service and return the result.

from app.services import health_service

def health():
    # Ask the service for the health status.
    result = health_service.get_health_status()
    # Return it. FastAPI sends it back as JSON.
    return result