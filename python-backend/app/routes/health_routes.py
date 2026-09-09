# FILE: app/routes/health_routes.py
# JOB: Define the health URLs.

from fastapi import APIRouter, Response
from app.controllers import health_controller

router = APIRouter()


# GET /health - the simple, fast check.
@router.get("/health")
def health_route():
    return health_controller.health()


# GET /health/deep - the real check.
@router.get("/health/deep")
def health_deep_route(response: Response):
    report = health_controller.health_deep()

    # Set the status code. 503 means the service is unavailable.
    # Monitoring tools watch the code, not the words.
    if report.get("status") == "down":
        response.status_code = 503

    return report
