# FILE: app/config/settings.py
# JOB: Hold shared settings for the Python backend.

import os

# Read the Hugging Face key from the environment (from .env).
# We will use this in Part 2 when we call AI models.
# If it is not set yet, we store an empty string for now.
HUGGINGFACE_API_KEY = os.environ.get("HUGGINGFACE_API_KEY", "")