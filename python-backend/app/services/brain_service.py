# FILE: app/services/brain_service.py
# JOB: Decide (Part 1) plus run the full thinking loop (Part 2).

import json
from app.config import openai_client

client = openai_client.client
MODEL = openai_client.OPENAI_MODEL


# ---- Part 1: rules for clear emergencies ----
def check_emergency_rules(situation):
    event = situation.get("event_type", "")
    if event in ["smoke", "fire", "fall"]:
        return {
            "action": "emergency",
            "reason": "Dangerous event detected: " + event,
            "used_gpt": False
        }
    return None


# ---- Part 1: ask GPT for the soft decision ----
def ask_gpt(situation):
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

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=5,
        temperature=0
    )

    answer = response.choices[0].message.content.strip().lower()
    return {
        "action": answer,
        "reason": "Decided by GPT",
        "used_gpt": True
    }


# ---- Part 1: the single decide step ----
def decide(situation):
    emergency = check_emergency_rules(situation)
    if emergency is not None:
        return emergency
    return ask_gpt(situation)


# ---- Part 2: run the whole thinking loop ----
# We import the graph here (inside the function is also fine, but top import
# would create a loop, so we import it lazily here to keep things simple).
def run_brain(situation):
    # Import here to avoid an import loop between nodes and this service.
    from app.brain.graph import brain_graph

    # The loop starts with the raw situation in the state.
    start_state = {"situation": situation}

    # Run the whole graph. It returns the final state after all nodes.
    final_state = brain_graph.invoke(start_state)

    return final_state