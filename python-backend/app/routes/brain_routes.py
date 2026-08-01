# FILE: app/routes/brain_routes.py
# JOB: Routes for the single decide and the full brain loop.

from fastapi import APIRouter, Request
from app.controllers import brain_controller

router = APIRouter()

# Single decide step (from Part 1).
@router.post("/decide")
async def decide_route(request: Request):
    situation = await request.json()
    return brain_controller.decide(situation)


# Full thinking loop (Part 2).
@router.post("/think")
async def think_route(request: Request):
    situation = await request.json()
    return brain_controller.run_brain(situation)