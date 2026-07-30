# FILE: main.py
# JOB: Create the app and connect the routes.

from fastapi import FastAPI
from app.routes import health_routes

# Create the FastAPI application.
app = FastAPI()

# Connect the health router.
# Now GET /health is handled by our layered code.
app.include_router(health_routes.router)