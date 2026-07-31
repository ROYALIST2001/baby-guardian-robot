# FILE: app/services/baby_service.py
# JOB: Send an image to Colab and find if a baby (person) is present.

import os
import requests

# Read the Colab URL from the environment (from .env).
COLAB_AI_URL = os.environ.get("COLAB_AI_URL", "")

# The model calls a baby a "person". We look for this label.
PERSON_LABEL = "person"

# We ignore very weak guesses. Only keep detections above this score.
MIN_SCORE = 0.7


def detect_baby(image_bytes):
    # Safety check: make sure we have a Colab URL.
    if not COLAB_AI_URL:
        raise Exception("COLAB_AI_URL is not set in .env")

    # The Colab server has an endpoint called /detect for images.
    url = COLAB_AI_URL + "/detect"

    # Send the image as a file upload to Colab.
    files = {"file": ("image", image_bytes)}
    response = requests.post(url, files=files)

    # Check the request worked.
    if response.status_code != 200:
        raise Exception("Colab server error " + str(response.status_code) + ": " + response.text)

    # The Colab server returns { "results": [ ... ] }.
    data = response.json()
    all_objects = data["results"]

    # Keep only "person" detections with a good enough score.
    person_boxes = []
    for obj in all_objects:
        label = obj["label"].lower()
        score = obj["score"]
        if label == PERSON_LABEL and score >= MIN_SCORE:
            person_boxes.append({
                "score": score,
                "box": obj["box"]   # the box has left, top, right, bottom
            })

    # Build the clean answer.
    baby_found = len(person_boxes) > 0
    return {
        "baby_found": baby_found,
        "count": len(person_boxes),
        "boxes": person_boxes
    }