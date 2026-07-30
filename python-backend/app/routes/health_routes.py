# FILE: app/routes/health_routes.py
# JOB: Define the URL and connect it to the controller.

from fastapi import APIRouter
from app.controllers import health_controller

# A router is a small group of routes, like express.Router in Node.
router = APIRouter()

# When someone visits GET /health, call the controller's health function.
@router.get("/health")
def health_route():
    return health_controller.health()