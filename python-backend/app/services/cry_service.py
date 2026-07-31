# FILE: app/services/cry_service.py
# JOB: Send audio to our Colab model server and decide if crying.

import os
import requests

# Read the Colab URL from the environment (from .env).
COLAB_AI_URL = os.environ.get("COLAB_AI_URL", "")

# Words that suggest a baby is crying.
CRYING_WORDS = ["cry", "crying", "baby", "infant", "wail", "sob"]


def detect_cry(audio_bytes):
    # Safety check: make sure we have a Colab URL.
    if not COLAB_AI_URL:
        raise Exception("COLAB_AI_URL is not set in .env")

    # The Colab server has one endpoint called /classify.
    url = COLAB_AI_URL + "/classify"

    # Send the audio as a file upload to Colab.
    files = {"file": ("audio", audio_bytes)}
    response = requests.post(url, files=files)

    # Check the request worked.
    if response.status_code != 200:
        raise Exception("Colab server error " + str(response.status_code) + ": " + response.text)

    # The Colab server returns { "results": [ ... ] }.
    data = response.json()
    results = data["results"]

    # Safety check.
    if not isinstance(results, list) or len(results) == 0:
        raise Exception("Unexpected answer from the model")

    # The first item is the top guess.
    top = results[0]
    top_label = top["label"].lower()
    top_score = top["score"]

    # Decide if the top label means crying.
    is_crying = False
    for word in CRYING_WORDS:
        if word in top_label:
            is_crying = True
            break

    return {
        "is_crying": is_crying,
        "label": top["label"],
        "score": top_score
    }