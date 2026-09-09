# FILE: app/services/health_service.py
# JOB: Actually test the Python backend's connections.

import time
import redis
from app.config.supabase_client import supabase

# How long we wait before calling a check failed.
TIMEOUT_SECONDS = 3


# ---- The simple check. Only proves the server is answering. ----
def get_health_status():
    return {
        "status": "ok",
        "service": "python-ai-backend",
    }


# ---- Check 1: the database ----
def check_database():
    started = time.time()
    try:
        # Ask for one row. This proves the connection works.
        supabase.table("profiles").select("id").limit(1).execute()
        return {
            "name": "database",
            "status": "up",
            "required": True,
            "ms": int((time.time() - started) * 1000),
        }
    except Exception as error:
        return {
            "name": "database",
            "status": "down",
            "required": True,
            "ms": int((time.time() - started) * 1000),
            "error": str(error),
        }


# ---- Check 2: Redis (used for the AI cache) ----
def check_redis():
    started = time.time()
    try:
        # Make our own connection with a short timeout,
        # so a frozen Redis cannot hang this check.
        client = redis.Redis(
            host="redis",
            port=6379,
            socket_connect_timeout=TIMEOUT_SECONDS,
            socket_timeout=TIMEOUT_SECONDS,
        )
        if not client.ping():
            raise Exception("Redis did not reply")
        return {
            "name": "redis_cache",
            "status": "up",
            "required": True,
            "ms": int((time.time() - started) * 1000),
        }
    except Exception as error:
        return {
            "name": "redis_cache",
            "status": "down",
            "required": True,
            "ms": int((time.time() - started) * 1000),
            "error": str(error),
        }


# ---- Check 3: is the AI model server address set? ----
# We do NOT call Colab here. Waking it up on every health check
# would be slow and wasteful. We only check the setting exists.
def check_ai_config():
    import os

    colab_url = os.environ.get("COLAB_AI_URL", "")
    if colab_url:
        return {
            "name": "ai_models",
            "status": "up",
            "required": False,
            "note": "Address is set. Not called, to avoid waking it.",
        }
    return {
        "name": "ai_models",
        "status": "down",
        "required": False,
        "error": "COLAB_AI_URL is not set. The AI senses will not work.",
    }


# ---- Check 4: is the OpenAI key set? ----
def check_openai_config():
    import os

    key = os.environ.get("OPENAI_API_KEY", "")
    if key:
        return {
            "name": "openai",
            "status": "up",
            "required": False,
            "note": "Key is set. Not called, to avoid cost.",
        }
    return {
        "name": "openai",
        "status": "down",
        "required": False,
        "error": "OPENAI_API_KEY is not set. The brain will use rules only.",
    }


# ---- Work out the overall state ----
# Pure logic, easy to test.
def overall_status(checks):
    # Any required piece down means the whole thing is down.
    for check in checks:
        if check.get("required") and check.get("status") == "down":
            return "down"

    # An optional piece down means degraded, not down.
    for check in checks:
        if not check.get("required") and check.get("status") == "down":
            return "degraded"

    return "up"


# ---- Run every check and build the report ----
def check_all():
    started = time.time()

    checks = [
        check_database(),
        check_redis(),
        check_ai_config(),
        check_openai_config(),
    ]

    return {
        "status": overall_status(checks),
        "service": "python-ai-backend",
        "total_ms": int((time.time() - started) * 1000),
        "checks": checks,
    }
