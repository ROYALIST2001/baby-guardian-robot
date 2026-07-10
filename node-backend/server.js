// ---- server.js ----

// Express builds our web server.
const express = require("express");

// The Supabase client lets our server talk to the database.
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 3000;

// Read our secret values from the environment (loaded from the .env file).
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

// Create ONE Supabase client we reuse for all database calls.
// This runs on our trusted server, so we use the SECRET key (full access).
// This key must NEVER be placed in the mobile app or any public code.
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

// Health check from Phase 1 — confirms the server itself is alive.
app.get("/health", (req, res) => {
   res.json({ status: "ok", service: "node-backend" });
});

// NEW: a test route that reads all babies from the database.
// The word "async" lets us "await" (wait for) the database to answer.
app.get("/db-test", async (req, res) => {
   // Ask Supabase: from the "babies" table, select every column.
   const { data, error } = await supabase.from("babies").select("*");

   // If the database returned an error, report it clearly.
   if (error) {
      return res.status(500).json({ ok: false, error: error.message });
   }

   // Otherwise, send back the rows we found.
   res.json({ ok: true, babies: data });
});

app.listen(PORT, () => {
   console.log(`Node backend running on port ${PORT}`);
});

// Notice the route is named /db-test, not /api/db-test. That's because your Nginx front door adds the /api/ part — exactly like /health became /api/health in Phase 1.
