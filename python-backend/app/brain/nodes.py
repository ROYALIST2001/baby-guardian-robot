# FILE: app/brain/nodes.py
# JOB: The brain's nodes, now with an emergency fast path and real learning.

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

    print("PERCEIVE: event =", facts["event_type"], "| memory items:", len(patterns))
    return {"facts": facts}


# ---- Small helper: decide severity (pure logic, testable) ----
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


# ---- NEW: the routing function for the conditional edge ----
# It returns the NAME of the next node to run.
def route_after_analyze(state: BrainState):
    severity = state.get("severity", "calm")

    if severity == "emergency":
        # Skip the Decide node completely. No GPT. Fixed rules only.
        print("ROUTE: emergency, taking the fast path")
        return "emergency_act"

    print("ROUTE: normal, going to decide")
    return "decide"


# ---- Node 3: Decide (only for non-emergencies now) ----
def decide(state: BrainState):
    facts = state.get("facts", {})
    decision = brain_service.decide(facts)
    print("DECIDE: action =", decision["action"])
    return {
        "action": decision["action"],
        "reason": decision["reason"],
        "used_gpt": decision["used_gpt"],
    }


# ---- Build the command list for an action ----
def build_commands(action, facts):
    if action == "emergency":
        return [
            {"command": "alarm", "action": "on"},
            {"command": "move", "direction": "stop"},
        ]

    if action == "care":
        # Pick the lullaby with the best success rate for THIS baby.
        patterns = facts.get("patterns", {})
        track = pattern_service.pick_best_lullaby(patterns)

        return [
            {"command": "music", "action": "play", "track": track},
            {"command": "move", "direction": "forward"},
        ]

    return []


# ---- NEW Node: EmergencyAct (the fast path) ----
# No GPT. No thinking. Fixed, predictable, safe.
def emergency_act(state: BrainState):
    facts = state.get("facts", {})

    commands = build_commands("emergency", facts)

    print("EMERGENCY ACT: alarm on, robot stopped. No GPT used.")
    return {
        "action": "emergency",
        "reason": "Emergency rules: " + str(facts.get("event_type")),
        "used_gpt": False,
        "action_result": "Emergency: alarm on, robot stopped.",
        "commands": commands,
    }


# ---- Node 4: Act (the normal path) ----
def act(state: BrainState):
    action = state.get("action", "nothing")
    facts = state.get("facts", {})

    commands = build_commands(action, facts)

    if action == "care":
        result = "Care: playing music and moving closer."
    elif action == "notify":
        result = "Notify: alerting the parent."
    else:
        result = "No action needed. All is calm."

    print("ACT:", result, "| commands:", len(commands))
    return {"action_result": result, "commands": commands}


# ---- Node 5: Learn (now records lullaby attempts) ----
def learn(state: BrainState):
    facts = state.get("facts", {})
    action = state.get("action", "nothing")
    commands = state.get("commands", [])

    baby_id = facts.get("baby_id", "")
    parent_id = facts.get("parent_id", "")

    if not baby_id or not parent_id:
        print("LEARN: no baby id, nothing saved")
        return {"learn_note": "No memory saved"}

    try:
        patterns = facts.get("patterns", {})

        # Remember the last action.
        pattern_service.save_pattern(baby_id, parent_id, "last_action", action)

        # Count crying events.
        if facts.get("event_type") == "crying":
            old_count = int(patterns.get("cry_count", "0"))
            pattern_service.save_pattern(baby_id, parent_id, "cry_count", old_count + 1)

        # NEW: if we played a lullaby, record that we TRIED it.
        # Whether it WORKED is checked later, by Node.
        for cmd in commands:
            if cmd.get("command") == "music" and cmd.get("action") == "play":
                track = cmd.get("track")
                pattern_service.record_lullaby_tried(baby_id, parent_id, track, patterns)

    except Exception as error:
        print("LEARN: could not save patterns:", str(error))

    note = "Event '" + str(facts.get("event_type")) + "' -> action '" + str(action) + "'."
    print("LEARN:", note)
    return {"learn_note": note}