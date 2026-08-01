# FILE: app/brain/state.py
# JOB: Define the "state", the data box passed through all nodes.

from typing import TypedDict


# TypedDict lets us describe the shape of our data box.
# Each line is one field the state can hold.
class BrainState(TypedDict, total=False):
    # The raw input given at the start.
    situation: dict

    # Filled by Perceive: the clean facts.
    facts: dict

    # Filled by Analyze: "emergency", "warning", or "calm".
    severity: str

    # Filled by Decide: the chosen action.
    action: str
    reason: str
    used_gpt: bool

    # Filled by Act: a short text of what was done.
    action_result: str

    # Filled by Learn: a short note to remember.
    learn_note: str