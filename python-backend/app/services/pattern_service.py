# FILE: app/services/pattern_service.py
# JOB: Simple memory functions for the brain nodes.

from app.repositories import pattern_repository


# Load patterns for a baby as a simple dictionary.
# Example return: { "best_lullaby": "Lullaby 3", "cry_count_today": "4" }
def load_patterns(baby_id):
    rows = pattern_repository.find_by_baby(baby_id)

    patterns = {}
    for row in rows:
        patterns[row["pattern_key"]] = row["pattern_value"]

    return patterns


# Save one pattern (memory) for a baby.
def save_pattern(baby_id, parent_id, key, value):
    pattern_repository.save_pattern(baby_id, parent_id, key, value)