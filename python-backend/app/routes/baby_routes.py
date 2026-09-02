# FILE: app/routes/brain_routes.py
# JOB: Routes for the brain, plus recording outcomes.

from fastapi import APIRouter, Request
from app.controllers import brain_controller

router = APIRouter()


# Single decide step.
@router.post("/decide")
async def decide_route(request: Request):
    situation = await request.json()
    return brain_controller.decide(situation)


# Full thinking loop.
@router.post("/think")
async def think_route(request: Request):
    situation = await request.json()
    return brain_controller.run_brain(situation)


# NEW: record that a lullaby worked.
# Node calls this after waiting to see if crying returned.
@router.post("/lullaby-worked")
async def lullaby_worked_route(request: Request):
    body = await request.json()
    return brain_controller.lullaby_worked(body)