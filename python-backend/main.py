# FILE: main.py
# JOB: Create the app and connect all routes.

# Sentry must load FIRST, before anything else,
# so it can watch every other file.
from app.config import sentry

from fastapi import FastAPI
from app.routes import health_routes
from app.routes import cry_routes
from app.routes import baby_routes
from app.routes import brain_routes
from app.routes import emotion_routes   # new

app = FastAPI()

# Connect the routers.
app.include_router(health_routes.router)
app.include_router(cry_routes.router)
app.include_router(baby_routes.router)
app.include_router(brain_routes.router)
app.include_router(emotion_routes.router)   # new
