# FILE: app/services/brain_service.py
# JOB: Decide what to do. Rules for danger, GPT for soft choices.

from app.config import openai_client
from app.services import pattern_service

client = openai_client.client
MODEL = openai_client.OPENAI_MODEL


# ---- Rules for clear emergencies (no GPT, no cost) ----
def check_emergency_rules(situation):
    event = situation.get("event_type", "")
    if event in ["smoke", "fire", "fall"]:
        return {
            "action": "emergency",
            "reason": "Dangerous event detected: " + event,
            "used_gpt": False
        }
    return None


# ---- NEW: build a clear, readable prompt ----
# This is a separate function so it is easy to read and easy to test.
def build_prompt(situation):
    # Describe what is happening now, in plain words.
    event = situation.get("event_type", "none")
    now_lines = ["The current event is: " + str(event) + "."]

    if situation.get("duration_minutes"):
        now_lines.append(
            "It has lasted " + str(situation.get("duration_minutes")) + " minutes."
        )

    if not situation.get("baby_found", True):
        now_lines.append("The camera cannot currently see the baby.")

    # Describe the history, in plain words.
    patterns = situation.get("patterns", {})
    history = pattern_service.describe_patterns(patterns)

    prompt = (
        "You are a baby care assistant for a monitoring robot.\n\n"
        "SITUATION NOW:\n" + " ".join(now_lines) + "\n\n"
        "HISTORY FOR THIS BABY:\n" + history + "\n\n"
        "Use the history to make a better choice. "
        "Choose ONE action from this list: care, notify, nothing.\n"
        "care = play a lullaby and move closer to comfort the baby.\n"
        "notify = tell the parent, but do not act.\n"
        "nothing = all is fine, do nothing.\n\n"
        "Answer with only the one word."
    )

    return prompt


# ---- Ask GPT for the soft decision ----
def ask_gpt(situation):
    prompt = build_prompt(situation)

    # Print the prompt so you can see exactly what the AI was told.
    print("PROMPT SENT TO GPT:\n" + prompt)

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=5,
        temperature=0
    )

    answer = response.choices[0].message.content.strip().lower()

    return {
        "action": answer,
        "reason": "Decided by GPT using the baby's history",
        "used_gpt": True
    }


# ---- The single decide step ----
def decide(situation):
    emergency = check_emergency_rules(situation)
    if emergency is not None:
        return emergency
    return ask_gpt(situation)


# ---- Run the whole thinking loop ----
def run_brain(situation):
    from app.brain.graph import brain_graph

    start_state = {"situation": situation}
    final_state = brain_graph.invoke(start_state)

    return final_state