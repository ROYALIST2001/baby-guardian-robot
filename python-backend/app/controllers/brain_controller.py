# FILE: app/controllers/brain_controller.py
# JOB: Read the situation, call the brain service, return the result.

from app.services import brain_service


def decide(situation):
    try:
        result = brain_service.decide(situation)
        return result
    except Exception as error:
        return {"error": str(error)}