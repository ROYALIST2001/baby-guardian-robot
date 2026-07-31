# FILE: app/routes/baby_routes.py
# JOB: Define the URL for baby detection and accept an image upload.

from fastapi import APIRouter, UploadFile, File
from app.controllers import baby_controller

router = APIRouter()

# POST /detect-baby with an uploaded image file.
@router.post("/detect-baby")
async def detect_baby_route(file: UploadFile = File(...)):
    return await baby_controller.detect_baby(file)