# FILE: app/services/baby_service.py
# JOB: Detect a baby (person) in an image, using both caches.

import os
import requests
from app.config import cache

COLAB_AI_URL = os.environ.get("COLAB_AI_URL", "")
PERSON_LABEL = "person"
MIN_SCORE = 0.7


def detect_baby(baby_id, image_bytes):
    if not COLAB_AI_URL:
        raise Exception("COLAB_AI_URL is not set in .env")

    # ---- Check 1: exact-match cache ----
    exact_key = cache.make_exact_key("baby", image_bytes)
    exact_answer = cache.get_exact(exact_key)
    if exact_answer is not None:
        print("Exact cache hit for baby")
        return exact_answer

    # ---- Check 2: time-window cache ----
    recent_key = cache.make_recent_key("baby_recent", baby_id)
    recent_answer = cache.get_recent(recent_key)
    if recent_answer is not None:
        print("Recent cache hit for baby (same baby, last few seconds)")
        return recent_answer

    # ---- Both missed. Call the model. ----
    print("Cache miss. Calling the baby detection model.")
    url = COLAB_AI_URL + "/detect"
    files = {"file": ("image", image_bytes)}
    response = requests.post(url, files=files)

    if response.status_code != 200:
        raise Exception("Colab server error " + str(response.status_code) + ": " + response.text)

    data = response.json()
    all_objects = data["results"]

    person_boxes = []
    for obj in all_objects:
        label = obj["label"].lower()
        score = obj["score"]
        if label == PERSON_LABEL and score >= MIN_SCORE:
            person_boxes.append({
                "score": score,
                "box": obj["box"]
            })

    answer = {
        "baby_found": len(person_boxes) > 0,
        "count": len(person_boxes),
        "boxes": person_boxes
    }

    # ---- Save in BOTH caches ----
    cache.set_exact(exact_key, answer)
    cache.set_recent(recent_key, answer)

    return answer