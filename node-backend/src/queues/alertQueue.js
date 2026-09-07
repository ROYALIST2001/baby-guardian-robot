// FILE: src/queues/alertQueue.js
// JOB: The waiting list for alerts. Adding a job is instant.
//      The worker takes them off the list and sends them.

const { Queue } = require("bullmq");

// Where the queue lives: our Redis container.
// "redis" is the service name from docker-compose.
const connection = {
   host: "redis",
   port: 6379,
};

// Create the queue. Its name is "alerts".
// All jobs live under this name in Redis.
const alertQueue = new Queue("alerts", { connection: connection });

// ---- Add a NOTIFICATION job (for warnings) ----
// Used for crying, distress, baby not visible.
async function queueNotification(event) {
   await alertQueue.add(
      "notification", // the job type. The worker checks this name.
      { event: event }, // the job data. The worker reads this.
      {
         attempts: 3, // try up to 3 times before giving up
         backoff: {
            type: "exponential",
            delay: 5000, // wait 5s, then 10s, then 20s between tries
         },
         removeOnComplete: true, // clean up successful jobs
         removeOnFail: false, // KEEP failed jobs, so we can see what broke
      },
   );

   console.log("QUEUE: notification job added for", event.event_type);
}

// ---- Add an EMERGENCY job (maximum effort) ----
// Used for smoke, fire, fall.
async function queueEmergency(event) {
   await alertQueue.add(
      "emergency",
      { event: event },
      {
         attempts: 10, // an emergency gets 10 tries
         backoff: {
            type: "exponential",
            delay: 3000, // start retrying faster than a warning
         },
         priority: 1, // 1 is the highest. Jumps ahead of warnings.
         removeOnComplete: true,
         removeOnFail: false,
      },
   );

   console.log("QUEUE: EMERGENCY job added for", event.event_type);
}

module.exports = {
   alertQueue: alertQueue,
   queueNotification: queueNotification,
   queueEmergency: queueEmergency,
};
