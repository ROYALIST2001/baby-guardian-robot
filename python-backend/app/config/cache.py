# FILE: app/config/cache.py
# JOB: Two caches:
#   1) exact-match cache: key made from the file bytes.
#   2) time-window cache: key made from the baby id, with a short life.

import json
import hashlib
import redis

# Connect to the Redis container.
redis_client = redis.Redis(host="redis", port=6379, decode_responses=True)

# Time limits (in seconds).
EXACT_TTL_SECONDS = 3600   # exact-match answers live 1 hour
RECENT_TTL_SECONDS = 5     # time-window answers live 5 seconds


# ---------- EXACT-MATCH CACHE ----------

# Make a key from the file bytes. prefix is "cry" or "baby".
def make_exact_key(prefix, file_bytes):
    fingerprint = hashlib.md5(file_bytes).hexdigest()
    return prefix + ":" + fingerprint


# Read an exact-match answer. Returns the answer or None.
def get_exact(key):
    value = redis_client.get(key)
    if value is None:
        return None
    return json.loads(value)


# Save an exact-match answer (lives 1 hour).
def set_exact(key, answer):
    text = json.dumps(answer)
    redis_client.set(key, text, ex=EXACT_TTL_SECONDS)


# ---------- TIME-WINDOW CACHE (per baby) ----------

# Make a key from the baby id. prefix is "cry_recent" or "baby_recent".
def make_recent_key(prefix, baby_id):
    return prefix + ":" + str(baby_id)


# Read a recent answer for this baby. Returns the answer or None.
def get_recent(key):
    value = redis_client.get(key)
    if value is None:
        return None
    return json.loads(value)


# Save a recent answer (lives only 5 seconds).
def set_recent(key, answer):
    text = json.dumps(answer)
    redis_client.set(key, text, ex=RECENT_TTL_SECONDS)