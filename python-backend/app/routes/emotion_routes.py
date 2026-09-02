# FILE: app/routes/emotion_routes.py
# JOB: Define the URL for expression detection.

from fastapi import APIRouter, UploadFile, File, Form
from app.controllers import emotion_controller

router = APIRouter()


# POST /detect-emotion with an image file and a baby id.
@router.post("/detect-emotion")
async def detect_emotion_route(baby_id: str = Form(...), file: UploadFile = File(...)):
    return await emotion_controller.detect_emotion(baby_id, file)