# FILE: app/controllers/brain_controller.py
# JOB: Handlers for the brain.

from app.services import brain_service
from app.services import pattern_service


# Single decide step.
def decide(situation):
    try:
        result = brain_service.decide(situation)
        return result
    except Exception as error:
        return {"error": str(error)}


# Full thinking loop.
def run_brain(situation):
    try:
        result = brain_service.run_brain(situation)
        return result
    except Exception as error:
        return {"error": str(error)}


# NEW: record that a lullaby worked.
def lullaby_worked(body):
    try:
        baby_id = body.get("baby_id")
        parent_id = body.get("parent_id")
        track = body.get("track")

        if not baby_id or not parent_id or not track:
            return {"error": "baby_id, parent_id and track are required"}

        pattern_service.record_lullaby_worked(baby_id, parent_id, track)
        return {"ok": True}
    except Exception as error:
        return {"error": str(error)}