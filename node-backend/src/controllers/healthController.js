// FILE: src/controllers/healthController.js
// JOB: Return the health report, and serve the status dashboard.

const healthService = require("../services/healthService");

// GET /health
// The simple, fast check.
function simple(req, res) {
   res.json({ status: "ok", service: "node-backend" });
}

// GET /health/deep
// The real check. Tests every connection.
async function deep(req, res) {
   try {
      const report = await healthService.checkAll();

      // 200 = healthy or degraded. 503 = service unavailable.
      const code = report.status === "down" ? 503 : 200;

      res.status(code).json(report);
   } catch (error) {
      res.status(503).json({
         status: "down",
         error: "The health check itself failed: " + error.message,
      });
   }
}

// GET /status
// A human-friendly page showing everything at a glance.
function dashboard(req, res) {
   res.send(`
<html>
  <head>
    <title>Baby Guardian - System Status</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        font-family: -apple-system, Arial, sans-serif;
        background: #f4f6f8;
        margin: 0;
        padding: 20px;
        color: #222;
      }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .sub { color: #666; font-size: 13px; margin-bottom: 20px; }

      /* The big banner at the top. */
      .banner {
        padding: 18px;
        border-radius: 10px;
        color: white;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 24px;
        text-align: center;
      }
      .up { background: #2e7d32; }
      .degraded { background: #e0a800; }
      .down { background: #cc0000; }

      h2 { font-size: 15px; margin: 20px 0 10px 0; color: #444; }

      /* One card per check. */
      .card {
        background: white;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        border-left: 5px solid #ccc;
      }
      .card.up { border-left-color: #2e7d32; background: white; }
      .card.degraded { border-left-color: #e0a800; background: white; }
      .card.down { border-left-color: #cc0000; background: #fff5f5; }

      .name { font-weight: bold; flex: 1; }
      .state { font-size: 12px; text-transform: uppercase; margin-right: 12px; }
      .state.up { color: #2e7d32; }
      .state.degraded { color: #b58900; }
      .state.down { color: #cc0000; }
      .ms { font-size: 12px; color: #888; width: 60px; text-align: right; }
      .err { font-size: 12px; color: #cc0000; margin-top: 6px; }
      .optional { font-size: 11px; color: #888; margin-left: 8px; }
    </style>
  </head>
  <body>
    <h1>Baby Guardian System Status</h1>
    <div class="sub" id="updated">Loading...</div>

    <div class="banner" id="banner">Checking...</div>

    <h2>Node Backend</h2>
    <div id="node"></div>

    <h2>Python AI Backend</h2>
    <div id="python"></div>

    <script>
      // Draw one card for a single check.
      function drawCard(check) {
        var status = check.status;
        var ms = check.ms !== undefined ? check.ms + " ms" : "";
        var optional = check.required === false
          ? '<span class="optional">optional</span>' : '';
        var error = check.error
          ? '<div class="err">' + check.error + '</div>' : '';

        return '<div class="card ' + status + '">' +
                 '<div style="flex:1">' +
                   '<span class="name">' + check.name + '</span>' + optional +
                   error +
                 '</div>' +
                 '<span class="state ' + status + '">' + status + '</span>' +
                 '<span class="ms">' + ms + '</span>' +
               '</div>';
      }

      // Draw all the cards for one backend.
      function drawChecks(elementId, report) {
        var box = document.getElementById(elementId);

        if (!report || !report.checks) {
          box.innerHTML = '<div class="card down">' +
                          '<span class="name">Could not reach this backend</span>' +
                          '<span class="state down">down</span></div>';
          return "down";
        }

        var html = "";
        for (var i = 0; i < report.checks.length; i++) {
          html += drawCard(report.checks[i]);
        }
        box.innerHTML = html;
        return report.status;
      }

      // Fetch one report. Returns null if we cannot reach it at all.
      async function fetchReport(url) {
        try {
          var response = await fetch(url);
          return await response.json();
        } catch (e) {
          return null;
        }
      }

      // Work out the worst state of the two, and show it in the banner.
      function worstOf(a, b) {
        if (a === "down" || b === "down") return "down";
        if (a === "degraded" || b === "degraded") return "degraded";
        return "up";
      }

      // Load everything and draw the page.
      async function refresh() {
        var nodeReport = await fetchReport("/api/health/deep");
        var pythonReport = await fetchReport("/ai/health/deep");

        var nodeStatus = drawChecks("node", nodeReport);
        var pythonStatus = drawChecks("python", pythonReport);

        var overall = worstOf(nodeStatus, pythonStatus);

        var banner = document.getElementById("banner");
        banner.className = "banner " + overall;

        if (overall === "up") {
          banner.innerHTML = "ALL SYSTEMS WORKING";
        } else if (overall === "degraded") {
          banner.innerHTML = "PARTLY WORKING - some optional parts are down";
        } else {
          banner.innerHTML = "SYSTEM DOWN - something important is broken";
        }

        document.getElementById("updated").innerHTML =
          "Last checked: " + new Date().toLocaleTimeString() +
          " (refreshes every 15 seconds)";
      }

      // Draw it now, then keep it fresh.
      refresh();
      setInterval(refresh, 15000);
    </script>
  </body>
</html>
  `);
}

module.exports = {
   simple: simple,
   deep: deep,
   dashboard: dashboard,
};
