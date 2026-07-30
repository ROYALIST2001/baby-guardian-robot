// FILE: src/config/supabase.js
// JOB: Create the database connection once and share it.

const { createClient } = require("@supabase/supabase-js");

// Read the secret values from the environment (from the .env file).
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// Create the client. This object is how we talk to the database.
const supabase = createClient(supabaseUrl, supabaseSecretKey);

// Share this client so other files can use it.
module.exports = supabase;
