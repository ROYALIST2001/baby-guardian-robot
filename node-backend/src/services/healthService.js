// FILE: src/services/healthService.js
// JOB: Actually test every piece of the system, and report the truth.

const axios = require("axios");
const supabase = require("../config/supabase");
const redisClient = require("../config/redis");
const mqttClient = require("../config/mqtt");

// How long we wait before calling a check failed.
// A health check must never hang, or it becomes the problem itself.
const TIMEOUT_MS = 3000;

// ---- A helper that gives up after a set time ----
// It races the real task against a timer. Whichever finishes first wins.
function withTimeout(promise, label) {
   const timer = new Promise(function (resolve, reject) {
      setTimeout(function () {
         reject(new Error(label + " timed out after " + TIMEOUT_MS + "ms"));
      }, TIMEOUT_MS);
   });

   return Promise.race([promise, timer]);
}

// ---- Check 1: the database ----
async function checkDatabase() {
   const startedAt = Date.now();

   try {
      // Ask for one row. This proves the connection really works.
      // "head: true" means do not send the row back, only check it worked.
      const query = supabase
         .from("profiles")
         .select("id", { count: "exact", head: true });

      await withTimeout(query, "database");

      return {
         name: "database",
         status: "up",
         required: true,
         ms: Date.now() - startedAt,
      };
   } catch (error) {
      return {
         name: "database",
         status: "down",
         required: true,
         ms: Date.now() - startedAt,
         error: error.message,
      };
   }
}

// ---- Check 2: Redis ----
async function checkRedis() {
   const startedAt = Date.now();

   try {
      // "ping" is Redis's own way of saying "are you there".
      // A healthy Redis replies with the word PONG.
      const reply = await withTimeout(redisClient.ping(), "redis");

      if (reply !== "PONG") {
         throw new Error("Redis gave an unexpected reply");
      }

      return {
         name: "redis",
         status: "up",
         required: true,
         ms: Date.now() - startedAt,
      };
   } catch (error) {
      return {
         name: "redis",
         status: "down",
         required: true,
         ms: Date.now() - startedAt,
         error: error.message,
      };
   }
}

// ---- Check 3: the MQTT broker ----
function checkMqtt() {
   const startedAt = Date.now();

   // The mqtt library keeps a "connected" flag for us.
   // No network call is needed, so this is instant.
   if (mqttClient.connected) {
      return {
         name: "mqtt_broker",
         status: "up",
         required: true,
         ms: Date.now() - startedAt,
      };
   }

   return {
      name: "mqtt_broker",
      status: "down",
      required: true,
      ms: Date.now() - startedAt,
      error: "Not connected to the broker",
   };
}

// ---- Check 4: the Python backend ----
async function checkPythonBackend() {
   const startedAt = Date.now();

   try {
      // Ask Python's own deep health endpoint.
      const response = await axios.get("http://python-backend:8000/health/deep", {
         timeout: TIMEOUT_MS,
      });

      // Python tells us its own overall state. We pass it through.
      const pythonStatus = response.data.status;

      return {
         name: "python_backend",
         status: pythonStatus === "up" ? "up" : "degraded",
         required: true,
         ms: Date.now() - startedAt,
         detail: response.data,
      };
   } catch (error) {
      return {
         name: "python_backend",
         status: "down",
         required: true,
         ms: Date.now() - startedAt,
         error: error.message,
      };
   }
}

// ---- Work out the overall state from all the checks ----
// Pure logic, so it is easy to test.
function overallStatus(checks) {
   // If any REQUIRED piece is down, the whole system is down.
   for (let i = 0; i < checks.length; i++) {
      if (checks[i].required && checks[i].status === "down") {
         return "down";
      }
   }

   // If anything is degraded, or an optional piece is down,
   // the system works but not fully.
   for (let i = 0; i < checks.length; i++) {
      if (checks[i].status === "degraded") {
         return "degraded";
      }
      if (!checks[i].required && checks[i].status === "down") {
         return "degraded";
      }
   }

   return "up";
}

// ---- Run every check and build the report ----
async function checkAll() {
   const startedAt = Date.now();

   // Run the slow checks AT THE SAME TIME, not one after another.
   // Promise.all waits for all of them together.
   const results = await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkPythonBackend(),
   ]);

   // The MQTT check is instant, so we just add it.
   results.push(checkMqtt());

   return {
      status: overallStatus(results),
      service: "node-backend",
      checked_at: new Date().toISOString(),
      total_ms: Date.now() - startedAt,
      checks: results,
   };
}

module.exports = {
   checkAll: checkAll,
   overallStatus: overallStatus,
};
