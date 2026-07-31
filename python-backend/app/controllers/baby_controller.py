# FILE: app/controllers/baby_controller.py
# JOB: Receive the image file and baby id, call the service.

from fastapi import UploadFile
from app.services import baby_service


async def detect_baby(baby_id: str, file: UploadFile):
    try:
        image_bytes = await file.read()
        result = baby_service.detect_baby(baby_id, image_bytes)
        return result
    except Exception as error:
        return {"error": str(error)}