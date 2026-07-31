# FILE: app/services/brain_service.py
# JOB: Decide what to do about a baby's situation.
#      Use fixed rules for emergencies. Use GPT for soft decisions.

import json
from app.config import openai_client

client = openai_client.client
MODEL = openai_client.OPENAI_MODEL


# ---- Layer 1: safe rules for clear emergencies (no GPT, no cost) ----
def check_emergency_rules(situation):
    # If smoke, fire, or a fall is present, it is always an emergency.
    event = situation.get("event_type", "")
    if event in ["smoke", "fire", "fall"]:
        return {
            "action": "emergency",
            "reason": "Dangerous event detected: " + event,
            "used_gpt": False
        }
    # No clear emergency found.
    return None


# ---- Layer 2: ask GPT for the soft decision ----
def ask_gpt(situation):
    # Build a short prompt. Short text keeps the cost low.
    # We ask GPT to answer with ONE word action.
    prompt = (
        "You are a baby care assistant. "
        "Based on the situation, choose ONE action from this list: "
        "care, notify, nothing. "
        "care = play music and comfort the baby. "
        "notify = tell the parent. "
        "nothing = all is fine. "
        "Answer with only the one word.\n\n"
        "Situation: " + json.dumps(situation)
    )

    # Call GPT.
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=5,        # we only need one word, so keep this tiny
        temperature=0        # 0 makes the answer steady and predictable
    )

    # Read GPT's answer text.
    answer = response.choices[0].message.content.strip().lower()

    return {
        "action": answer,
        "reason": "Decided by GPT",
        "used_gpt": True
    }


# ---- The main function that ties both layers together ----
def decide(situation):
    # Step 1: check the safe emergency rules first.
    emergency = check_emergency_rules(situation)
    if emergency is not None:
        return emergency

    # Step 2: not an emergency, so ask GPT for a soft decision.
    return ask_gpt(situation)