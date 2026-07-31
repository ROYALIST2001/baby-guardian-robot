# FILE: app/config/openai_client.py
# JOB: Create the OpenAI connection once and share it.

import os
from openai import OpenAI

# Read the key and model name from the environment (from .env).
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# The model name. Default is the cheap gpt-4.1-nano if not set.
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4.1-nano")

# Create the client. This object is how we talk to GPT.
client = OpenAI(api_key=OPENAI_API_KEY)