# FILE: app/controllers/emotion_controller.py
# JOB: Receive the image and baby id, call the service, return the result.

from fastapi import UploadFile
from app.services import emotion_service


async def detect_emotion(baby_id: str, file: UploadFile):
    try:
        image_bytes = await file.read()
        result = emotion_service.detect_emotion(baby_id, image_bytes)
        return result
    except Exception as error:
        return {"error": str(error)}