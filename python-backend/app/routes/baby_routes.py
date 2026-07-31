# FILE: app/routes/baby_routes.py
# JOB: Define the URL. Accept an image file and a baby id.

from fastapi import APIRouter, UploadFile, File, Form
from app.controllers import baby_controller

router = APIRouter()

# POST /detect-baby with a file and a baby_id form field.
@router.post("/detect-baby")
async def detect_baby_route(baby_id: str = Form(...), file: UploadFile = File(...)):
    return await baby_controller.detect_baby(baby_id, file)