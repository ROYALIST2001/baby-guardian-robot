# FILE: app/controllers/baby_controller.py
# JOB: Receive the image file, call the service, return the result.

from fastapi import UploadFile
from app.services import baby_service


async def detect_baby(file: UploadFile):
    try:
        # Read the whole uploaded image into bytes.
        image_bytes = await file.read()

        # Call the service to get the answer.
        result = baby_service.detect_baby(image_bytes)

        return result
    except Exception as error:
        return {"error": str(error)}