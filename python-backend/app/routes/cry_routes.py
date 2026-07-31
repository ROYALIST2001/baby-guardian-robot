# FILE: app/routes/cry_routes.py
# JOB: Define the URL for cry detection and accept a file upload.

from fastapi import APIRouter, UploadFile, File
from app.controllers import cry_controller

router = APIRouter()

# POST /detect-cry with an uploaded audio file.
# "UploadFile = File(...)" tells FastAPI to expect a file in the request.
@router.post("/detect-cry")
async def detect_cry_route(file: UploadFile = File(...)):
    return await cry_controller.detect_cry(file)