# FILE: app/brain/state.py
# JOB: Define the "state", the data box passed through all nodes.

from typing import TypedDict


class BrainState(TypedDict, total=False):
    situation: dict
    facts: dict
    severity: str
    action: str
    reason: str
    used_gpt: bool
    action_result: str

    # NEW: the list of commands the robot should run.
    commands: list

    learn_note: str