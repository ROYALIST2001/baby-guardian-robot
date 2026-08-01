# FILE: app/controllers/brain_controller.py
# JOB: Handlers for the single decide and the full brain loop.

from app.services import brain_service


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