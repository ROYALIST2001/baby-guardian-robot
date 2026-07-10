import os
from fastapi import FastAPI
from supabase import create_client, Client

app = FastAPI()

# Read secret values from the environment (loaded from the .env file).
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY")

# Create ONE Supabase client to reuse.
# Server-side and trusted, so we use the SECRET key (full access).
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

# Health check from Phase 1.
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "python-ai-backend"}

# NEW: a test route that reads all babies from the database.
@app.get("/db-test")
def db_test():
    # From the "babies" table, select every column, then run the query.
    response = supabase.table("babies").select("*").execute()
    # response.data holds the list of rows.
    return {"ok": True, "babies": response.data}