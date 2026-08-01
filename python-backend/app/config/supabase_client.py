# FILE: app/config/supabase_client.py
# JOB: Create the Supabase connection once and share it.

import os
from supabase import create_client

# Read the values from the environment (from .env).
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY", "")

# Create the client. The brain uses this to read and write patterns.
supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)