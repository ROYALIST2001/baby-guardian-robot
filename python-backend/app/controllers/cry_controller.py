# FILE: app/controllers/cry_controller.py
# JOB: Receive the audio file and baby id, call the service.

from fastapi import UploadFile
from app.services import cry_service


async def detect_cry(baby_id: str, file: UploadFile):
    try:
        audio_bytes = await file.read()
        result = cry_service.detect_cry(baby_id, audio_bytes)
        return result
    except Exception as error:
        return {"error": str(error)}