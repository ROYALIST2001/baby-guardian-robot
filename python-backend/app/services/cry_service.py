# FILE: app/services/cry_service.py
# JOB: Detect crying, using both caches. Now with a small testable helper.

import os
import requests
from app.config import cache

COLAB_AI_URL = os.environ.get("COLAB_AI_URL", "")
CRYING_WORDS = ["cry", "crying", "baby", "infant", "wail", "sob"]


# NEW small helper: decide if a label means crying.
# This is pure logic (no internet), so it is easy to test.
def is_crying_label(label):
    label = label.lower()
    for word in CRYING_WORDS:
        if word in label:
            return True
    return False


def detect_cry(baby_id, audio_bytes):
    if not COLAB_AI_URL:
        raise Exception("COLAB_AI_URL is not set in .env")

    # ---- Check 1: exact-match cache ----
    exact_key = cache.make_exact_key("cry", audio_bytes)
    exact_answer = cache.get_exact(exact_key)
    if exact_answer is not None:
        print("Exact cache hit for cry")
        return exact_answer

    # ---- Check 2: time-window cache ----
    recent_key = cache.make_recent_key("cry_recent", baby_id)
    recent_answer = cache.get_recent(recent_key)
    if recent_answer is not None:
        print("Recent cache hit for cry (same baby, last few seconds)")
        return recent_answer

    # ---- Both missed. Call the model. ----
    print("Cache miss. Calling the cry model.")
    url = COLAB_AI_URL + "/classify"
    files = {"file": ("audio", audio_bytes)}
    response = requests.post(url, files=files)

    if response.status_code != 200:
        raise Exception("Colab server error " + str(response.status_code) + ": " + response.text)

    data = response.json()
    results = data["results"]

    if not isinstance(results, list) or len(results) == 0:
        raise Exception("Unexpected answer from the model")

    top = results[0]
    top_label = top["label"]
    top_score = top["score"]

    # Use the new helper here.
    answer = {
        "is_crying": is_crying_label(top_label),
        "label": top_label,
        "score": top_score
    }

    # ---- Save in BOTH caches ----
    cache.set_exact(exact_key, answer)
    cache.set_recent(recent_key, answer)

    return answer