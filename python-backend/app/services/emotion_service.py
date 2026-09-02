# FILE: app/services/emotion_service.py
# JOB: Send a face image to the AI and decide if the baby looks distressed.

import os
import requests
from app.config import cache

COLAB_AI_URL = os.environ.get("COLAB_AI_URL", "")

# Emotions that suggest the baby is upset.
DISTRESS_EMOTIONS = ["sad", "angry", "fear", "disgust"]

# We ignore weak guesses. Only trust a reading above this score.
MIN_SCORE = 0.4


# ---- Small helper: does this label mean distress? ----
# Pure logic, so it is easy to test.
def is_distress_label(label):
    label = label.lower()
    for word in DISTRESS_EMOTIONS:
        if word in label:
            return True
    return False


def detect_emotion(baby_id, image_bytes):
    if not COLAB_AI_URL:
        raise Exception("COLAB_AI_URL is not set in .env")

    # ---- Check 1: exact-match cache (same image sent again) ----
    exact_key = cache.make_exact_key("emotion", image_bytes)
    exact_answer = cache.get_exact(exact_key)
    if exact_answer is not None:
        print("Exact cache hit for emotion")
        return exact_answer

    # ---- Check 2: time-window cache (same baby checked recently) ----
    recent_key = cache.make_recent_key("emotion_recent", baby_id)
    recent_answer = cache.get_recent(recent_key)
    if recent_answer is not None:
        print("Recent cache hit for emotion")
        return recent_answer

    # ---- Both missed. Call the model. ----
    print("Cache miss. Calling the emotion model.")
    url = COLAB_AI_URL + "/emotion"
    files = {"file": ("image", image_bytes)}
    response = requests.post(url, files=files)

    if response.status_code != 200:
        raise Exception("Colab server error " + str(response.status_code) + ": " + response.text)

    data = response.json()
    results = data["results"]

    if not isinstance(results, list) or len(results) == 0:
        raise Exception("Unexpected answer from the model")

    # The first item is the strongest guess.
    top = results[0]
    top_label = top["label"]
    top_score = top["score"]

    # Only trust the reading if the model is confident enough.
    # A weak guess on a baby's face is not worth acting on.
    if top_score < MIN_SCORE:
        distressed = False
    else:
        distressed = is_distress_label(top_label)

    answer = {
        "distressed": distressed,
        "emotion": top_label,
        "score": top_score,
    }

    # ---- Save in BOTH caches ----
    cache.set_exact(exact_key, answer)
    cache.set_recent(recent_key, answer)

    return answer