# FILE: app/repositories/pattern_repository.py
# JOB: Talk to the "baby_patterns" table. Only read and write.

from app.config.supabase_client import supabase


# Get all patterns for one baby.
def find_by_baby(baby_id):
    result = (
        supabase.table("baby_patterns")
        .select("*")
        .eq("baby_id", baby_id)
        .execute()
    )
    return result.data


# Save or update one pattern.
# If the key already exists for this baby, update it. If not, insert it.
def save_pattern(baby_id, parent_id, key, value):
    # First, check if this key already exists for this baby.
    existing = (
        supabase.table("baby_patterns")
        .select("*")
        .eq("baby_id", baby_id)
        .eq("pattern_key", key)
        .execute()
    )

    if existing.data and len(existing.data) > 0:
        # It exists. Update the value.
        supabase.table("baby_patterns").update(
            {"pattern_value": str(value)}
        ).eq("baby_id", baby_id).eq("pattern_key", key).execute()
    else:
        # It does not exist. Insert a new row.
        supabase.table("baby_patterns").insert(
            {
                "baby_id": baby_id,
                "parent_id": parent_id,
                "pattern_key": key,
                "pattern_value": str(value),
            }
        ).execute()