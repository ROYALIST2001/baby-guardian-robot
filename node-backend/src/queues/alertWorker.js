// FILE: src/queues/alertWorker.js
// JOB: Take alert jobs off the queue and REALLY send them.

const { Worker } = require("bullmq");
const profileService = require("../services/profileService");
const pushService = require("../services/pushService");

const connection = {
   host: "redis",
   port: 6379,
};

function start() {
   const worker = new Worker(
      "alerts",
      async function (job) {
         const event = job.data.event;
         const isEmergency = job.name === "emergency";

         console.log(
            "WORKER: handling",
            job.name,
            "for",
            event.event_type,
            "| attempt",
            job.attemptsMade + 1,
         );

         // Step 1: find out where to send it.
         const pushToken = await profileService.getPushToken(event.parent_id);

         // If the parent has no token, there is nothing we can do.
         // We do NOT throw here, because retrying would never help.
         if (!pushToken) {
            console.log("WORKER: this parent has no push token yet. Skipping.");
            return;
         }

         // Step 2: send the push. If this throws, BullMQ retries.
         await pushService.sendPush(pushToken, event, isEmergency);

         // Step 3 (Part 3 will add): for emergencies, also send SMS and call.
         if (isEmergency) {
            console.log("WORKER: SMS and phone call will be added in Part 3");
         }
      },
      { connection: connection },
   );

   worker.on("completed", function (job) {
      console.log("WORKER: job done ->", job.name);
   });

   worker.on("failed", function (job, err) {
      console.log("WORKER: job failed ->", err.message, "| will retry");
   });

   console.log("WORKER: alert worker started, watching the queue");

   return worker;
}

module.exports = { start: start };
