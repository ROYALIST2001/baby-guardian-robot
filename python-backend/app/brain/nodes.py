# FILE: app/brain/nodes.py
# JOB: The five nodes of the thinking loop.
#      Each node takes the state, does its job, and returns updates.

from app.brain.state import BrainState
from app.services import brain_service


# ---- Node 1: Perceive ----
def perceive(state: BrainState):
    # Read the raw situation.
    situation = state.get("situation", {})

    # Gather the facts we care about. Use safe defaults if missing.
    facts = {
        "event_type": situation.get("event_type", "none"),
        "is_crying": situation.get("is_crying", False),
        "baby_found": situation.get("baby_found", True),
        "duration_minutes": situation.get("duration_minutes", 0),
        "last_fed_hours": situation.get("last_fed_hours", 0),
    }

    print("PERCEIVE:", facts)
    # Return the part of the state we are adding.
    return {"facts": facts}


# ---- Node 2: Analyze ----
def analyze(state: BrainState):
    facts = state.get("facts", {})
    event = facts.get("event_type", "none")

    # Set severity based on the event.
    if event in ["smoke", "fire", "fall"]:
        severity = "emergency"
    elif facts.get("is_crying") or event == "crying":
        severity = "warning"
    else:
        severity = "calm"

    print("ANALYZE: severity =", severity)
    return {"severity": severity}


# ---- Node 3: Decide ----
def decide(state: BrainState):
    facts = state.get("facts", {})

    # Reuse our Part 1 brain: rules for danger, GPT for soft cases.
    decision = brain_service.decide(facts)

    print("DECIDE: action =", decision["action"])
    return {
        "action": decision["action"],
        "reason": decision["reason"],
        "used_gpt": decision["used_gpt"],
    }


# ---- Node 4: Act ----
def act(state: BrainState):
    action = state.get("action", "nothing")

    # For now, "acting" means recording what should happen.
    # Real actions (music, alerts) will connect in a later part.
    if action == "emergency":
        result = "Emergency protocol: alarm, alert parent, switch to manual."
    elif action == "care":
        result = "Play a lullaby and move closer to comfort the baby."
    elif action == "notify":
        result = "Send a notification to the parent."
    else:
        result = "No action needed. All is calm."

    print("ACT:", result)
    return {"action_result": result}


# ---- Node 5: Learn ----
def learn(state: BrainState):
    facts = state.get("facts", {})
    action = state.get("action", "nothing")

    # Make a short note about what happened.
    # For now we only record it. Saving to the database comes later.
    note = "For event '" + str(facts.get("event_type")) + "', chose action '" + str(action) + "'."

    print("LEARN:", note)
    return {"learn_note": note}