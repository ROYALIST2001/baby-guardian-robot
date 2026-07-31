# FILE: main.py
# JOB: Create the app and connect all routes.

from fastapi import FastAPI
from app.routes import health_routes
from app.routes import cry_routes
from app.routes import baby_routes   # new

app = FastAPI()

# Connect the routers.
app.include_router(health_routes.router)
app.include_router(cry_routes.router)
app.include_router(baby_routes.router)   # new