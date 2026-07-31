# FILE: app/routes/cry_routes.py
# JOB: Define the URL. Accept an audio file and a baby id.

from fastapi import APIRouter, UploadFile, File, Form
from app.controllers import cry_controller

router = APIRouter()

# POST /detect-cry with a file and a baby_id form field.
@router.post("/detect-cry")
async def detect_cry_route(baby_id: str = Form(...), file: UploadFile = File(...)):
    return await cry_controller.detect_cry(baby_id, file)