# FILE: app/brain/nodes.py
# JOB: The five nodes. Now with memory in Perceive and Learn.

from app.brain.state import BrainState
from app.services import brain_service
from app.services import pattern_service


# ---- Node 1: Perceive (now loads memory) ----
def perceive(state: BrainState):
    situation = state.get("situation", {})

    facts = {
        "event_type": situation.get("event_type", "none"),
        "is_crying": situation.get("is_crying", False),
        "baby_found": situation.get("baby_found", True),
        "duration_minutes": situation.get("duration_minutes", 0),
        "last_fed_hours": situation.get("last_fed_hours", 0),
        "baby_id": situation.get("baby_id", ""),
        "parent_id": situation.get("parent_id", ""),
    }

    # NEW: load this baby's past patterns (memory), if we have a baby id.
    patterns = {}
    baby_id = facts.get("baby_id")
    if baby_id:
        try:
            patterns = pattern_service.load_patterns(baby_id)
        except Exception as error:
            print("PERCEIVE: could not load patterns:", str(error))

    # Add the patterns into the facts, so Decide can use them.
    facts["patterns"] = patterns

    print("PERCEIVE:", facts)
    return {"facts": facts}


# ---- Node 2: Analyze (same as before) ----
def analyze(state: BrainState):
    facts = state.get("facts", {})
    event = facts.get("event_type", "none")

    if event in ["smoke", "fire", "fall"]:
        severity = "emergency"
    elif facts.get("is_crying") or event == "crying":
        severity = "warning"
    else:
        severity = "calm"

    print("ANALYZE: severity =", severity)
    return {"severity": severity}


# ---- Node 3: Decide (same as before, but facts now include memory) ----
def decide(state: BrainState):
    facts = state.get("facts", {})

    # The brain service reads the facts, which now include past patterns.
    decision = brain_service.decide(facts)

    print("DECIDE: action =", decision["action"])
    return {
        "action": decision["action"],
        "reason": decision["reason"],
        "used_gpt": decision["used_gpt"],
    }


# ---- Node 4: Act (same as before) ----
def act(state: BrainState):
    action = state.get("action", "nothing")

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


# ---- Node 5: Learn (now saves memory) ----
def learn(state: BrainState):
    facts = state.get("facts", {})
    action = state.get("action", "nothing")

    baby_id = facts.get("baby_id", "")
    parent_id = facts.get("parent_id", "")

    note = "For event '" + str(facts.get("event_type")) + "', chose action '" + str(action) + "'."

    # NEW: save memory, if we have a baby id.
    if baby_id and parent_id:
        try:
            # Remember the last action taken.
            pattern_service.save_pattern(baby_id, parent_id, "last_action", action)

            # If the baby was crying, increase the cry count.
            if facts.get("event_type") == "crying":
                old_patterns = facts.get("patterns", {})
                old_count = int(old_patterns.get("cry_count", "0"))
                new_count = old_count + 1
                pattern_service.save_pattern(baby_id, parent_id, "cry_count", new_count)
        except Exception as error:
            print("LEARN: could not save patterns:", str(error))

    print("LEARN:", note)
    return {"learn_note": note}