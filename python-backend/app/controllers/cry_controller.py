# FILE: app/controllers/cry_controller.py
# JOB: Receive the audio file, call the service, return the result.

from fastapi import UploadFile
from app.services import cry_service


async def detect_cry(file: UploadFile):
    try:
        # Read the whole uploaded file into bytes.
        audio_bytes = await file.read()

        # Call the service to get the answer.
        result = cry_service.detect_cry(audio_bytes)

        # Return the clean result.
        return result
    except Exception as error:
        # If anything failed, return a clear error message.
        return {"error": str(error)}