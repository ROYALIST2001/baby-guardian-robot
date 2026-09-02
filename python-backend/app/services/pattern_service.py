# FILE: app/services/pattern_service.py
# JOB: The brain's memory. Load patterns, and track what actually works.

from app.repositories import pattern_repository


# The lullabies the robot can play.
LULLABIES = ["lullaby1", "lullaby2", "lullaby3"]


# Load patterns for a baby as a simple dictionary.
def load_patterns(baby_id):
    rows = pattern_repository.find_by_baby(baby_id)

    patterns = {}
    for row in rows:
        patterns[row["pattern_key"]] = row["pattern_value"]

    return patterns


# Save one pattern (memory) for a baby.
def save_pattern(baby_id, parent_id, key, value):
    pattern_repository.save_pattern(baby_id, parent_id, key, value)


# ---- NEW: record that we TRIED a lullaby ----
def record_lullaby_tried(baby_id, parent_id, track, patterns):
    key = track + "_tried"
    old_count = int(patterns.get(key, "0"))
    save_pattern(baby_id, parent_id, key, old_count + 1)
    print("MEMORY: tried", track, "(", old_count + 1, "times total )")


# ---- NEW: record that a lullaby seemed to WORK ----
def record_lullaby_worked(baby_id, parent_id, track):
    # Load fresh, because time has passed since we tried it.
    patterns = load_patterns(baby_id)
    key = track + "_worked"
    old_count = int(patterns.get(key, "0"))
    save_pattern(baby_id, parent_id, key, old_count + 1)

    # Also update which lullaby is currently the best.
    best = pick_best_lullaby(load_patterns(baby_id))
    save_pattern(baby_id, parent_id, "best_lullaby", best)

    print("MEMORY:", track, "worked (", old_count + 1, "times ). Best is now", best)


# ---- NEW: choose the lullaby with the best success rate ----
def pick_best_lullaby(patterns):
    best_track = "lullaby1"     # a sensible default
    best_rate = -1.0

    for track in LULLABIES:
        tried = int(patterns.get(track + "_tried", "0"))
        worked = int(patterns.get(track + "_worked", "0"))

        # Skip lullabies we have not tried enough to judge.
        # Two tries is a low bar, but it stops one lucky result winning.
        if tried < 2:
            continue

        rate = worked / tried

        if rate > best_rate:
            best_rate = rate
            best_track = track

    return best_track


# ---- NEW: turn the memory into readable sentences for the AI ----
# GPT reads sentences far better than raw data.
def describe_patterns(patterns):
    if not patterns:
        return "No history yet for this baby."

    lines = []

    cry_count = patterns.get("cry_count")
    if cry_count:
        lines.append("This baby has cried " + str(cry_count) + " times before.")

    last_action = patterns.get("last_action")
    if last_action:
        lines.append("The last action taken was '" + str(last_action) + "'.")

    # Describe how well each lullaby has worked.
    for track in LULLABIES:
        tried = int(patterns.get(track + "_tried", "0"))
        worked = int(patterns.get(track + "_worked", "0"))
        if tried > 0:
            lines.append(
                track + " was played " + str(tried) + " times and calmed the baby "
                + str(worked) + " times."
            )

    if not lines:
        return "No useful history yet for this baby."

    return " ".join(lines)