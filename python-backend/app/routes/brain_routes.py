# FILE: app/routes/brain_routes.py
# JOB: Define the URL for the brain decision. Accept a situation as JSON.

from fastapi import APIRouter, Request
from app.controllers import brain_controller

router = APIRouter()

# POST /decide with a JSON body describing the situation.
@router.post("/decide")
async def decide_route(request: Request):
    # Read the JSON body from the request.
    situation = await request.json()
    return brain_controller.decide(situation)