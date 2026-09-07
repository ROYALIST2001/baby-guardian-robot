// FILE: src/queues/alertWorker.js
// JOB: Take alert jobs off the queue and send them.
//      For now it logs. Parts 2 and 3 will make it really send.

const { Worker } = require("bullmq");

const connection = {
   host: "redis",
   port: 6379,
};

// This function starts the worker. server.js calls it once.
function start() {
   // The worker watches the "alerts" queue.
   // The second argument is the function that DOES each job.
   const worker = new Worker(
      "alerts",
      async function (job) {
         const event = job.data.event;

         // job.name tells us which kind of job this is.
         if (job.name === "notification") {
            console.log(
               "WORKER: push notification ->",
               event.event_type,
               "| attempt",
               job.attemptsMade + 1,
            );
            // PART 2 will send a real Firebase push here.
         }

         if (job.name === "emergency") {
            console.log(
               "WORKER: EMERGENCY ALERT ->",
               event.event_type,
               "| attempt",
               job.attemptsMade + 1,
            );
            console.log("WORKER: would send SMS + phone call + WhatsApp");
            // PART 3 will send real Twilio SMS and calls here.
         }

         // If this function finishes with no error, the job is a SUCCESS.
         // If it throws an error, BullMQ will retry it.
      },
      { connection: connection },
   );

   // Runs when a job finishes successfully.
   worker.on("completed", function (job) {
      console.log("WORKER: job done ->", job.name);
   });

   // Runs when a job fails. BullMQ retries automatically.
   worker.on("failed", function (job, err) {
      console.log("WORKER: job failed ->", err.message, "| will retry");
   });

   console.log("WORKER: alert worker started, watching the queue");

   return worker;
}

module.exports = { start: start };
