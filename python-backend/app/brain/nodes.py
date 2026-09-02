# FILE: app/brain/nodes.py
# JOB: The five nodes. The Act node now builds REAL commands.

from app.brain.state import BrainState
from app.services import brain_service
from app.services import pattern_service


# ---- Node 1: Perceive (loads memory) ----
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

    patterns = {}
    baby_id = facts.get("baby_id")
    if baby_id:
        try:
            patterns = pattern_service.load_patterns(baby_id)
        except Exception as error:
            print("PERCEIVE: could not load patterns:", str(error))

    facts["patterns"] = patterns

    print("PERCEIVE:", facts)
    return {"facts": facts}


# ---- Small helper: decide severity from facts (pure logic, testable) ----
def get_severity(facts):
    event = facts.get("event_type", "none")

    if event in ["smoke", "fire", "fall"]:
        return "emergency"
    if facts.get("is_crying") or event == "crying":
        return "warning"
    return "calm"


# ---- Node 2: Analyze ----
def analyze(state: BrainState):
    facts = state.get("facts", {})
    severity = get_severity(facts)
    print("ANALYZE: severity =", severity)
    return {"severity": severity}


# ---- Node 3: Decide ----
def decide(state: BrainState):
    facts = state.get("facts", {})
    decision = brain_service.decide(facts)
    print("DECIDE: action =", decision["action"])
    return {
        "action": decision["action"],
        "reason": decision["reason"],
        "used_gpt": decision["used_gpt"],
    }


# ---- NEW small helper: build the command list for an action ----
# This is pure logic, so it is easy to test.
# It returns a LIST of commands. Node will send each one.
def build_commands(action, facts):
    # EMERGENCY: sound the alarm and stop moving.
    if action == "emergency":
        return [
            {"command": "alarm", "action": "on"},
            {"command": "move", "direction": "stop"},
        ]

    # CARE: play a lullaby and move closer to the baby.
    if action == "care":
        # Use the lullaby that worked before, if we remember one.
        patterns = facts.get("patterns", {})
        track = patterns.get("best_lullaby", "lullaby1")

        return [
            {"command": "music", "action": "play", "track": track},
            {"command": "move", "direction": "forward"},
        ]

    # NOTIFY: no robot command. The alert system handles this.
    if action == "notify":
        return []

    # NOTHING: all calm, so do nothing.
    return []


# ---- Node 4: Act (now builds real commands) ----
def act(state: BrainState):
    action = state.get("action", "nothing")
    facts = state.get("facts", {})

    # Build the list of commands for this action.
    commands = build_commands(action, facts)

    # Keep a short human-readable line too, so the logs stay easy to read.
    if action == "emergency":
        result = "Emergency: alarm on, robot stopped."
    elif action == "care":
        result = "Care: playing music and moving closer."
    elif action == "notify":
        result = "Notify: alerting the parent."
    else:
        result = "No action needed. All is calm."

    print("ACT:", result, "| commands:", len(commands))
    return {"action_result": result, "commands": commands}


# ---- Node 5: Learn (saves memory) ----
def learn(state: BrainState):
    facts = state.get("facts", {})
    action = state.get("action", "nothing")

    baby_id = facts.get("baby_id", "")
    parent_id = facts.get("parent_id", "")

    note = "For event '" + str(facts.get("event_type")) + "', chose action '" + str(action) + "'."

    if baby_id and parent_id:
        try:
            pattern_service.save_pattern(baby_id, parent_id, "last_action", action)

            if facts.get("event_type") == "crying":
                old_patterns = facts.get("patterns", {})
                old_count = int(old_patterns.get("cry_count", "0"))
                new_count = old_count + 1
                pattern_service.save_pattern(baby_id, parent_id, "cry_count", new_count)
        except Exception as error:
            print("LEARN: could not save patterns:", str(error))

    print("LEARN:", note)
    return {"learn_note": note}