// FILE: src/queues/alertWorker.js
// JOB: Take alert jobs off the queue and send them.
//      Warnings get a push. Emergencies get push + SMS + phone call.

const { Worker } = require("bullmq");
const profileService = require("../services/profileService");
const pushService = require("../services/pushService");
const smsService = require("../services/smsService");

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

         // We track what worked. If NOTHING worked, we retry the job.
         // If at least one channel worked, we do not, because retrying
         // would send the successful ones all over again.
         let anySucceeded = false;
         const problems = [];

         // ---- Channel 1: push notification (both levels) ----
         try {
            const pushToken = await profileService.getPushToken(event.parent_id);

            if (pushToken) {
               await pushService.sendPush(pushToken, event, isEmergency);
               anySucceeded = true;
            } else {
               console.log("WORKER: no push token for this parent");
            }
         } catch (error) {
            problems.push("push: " + error.message);
         }

         // ---- Channels 2 and 3: SMS and call (emergencies only) ----
         if (isEmergency) {
            const phoneNumber = await profileService.getPhoneNumber(event.parent_id);

            if (!phoneNumber) {
               console.log("WORKER: no phone number for this parent");
            } else {
               // ---- Channel 2: SMS ----
               try {
                  await smsService.sendSms(phoneNumber, event);
                  anySucceeded = true;
               } catch (error) {
                  problems.push("sms: " + error.message);
               }

               // ---- Channel 3: phone call ----
               try {
                  await smsService.makeCall(phoneNumber, event);
                  anySucceeded = true;
               } catch (error) {
                  problems.push("call: " + error.message);
               }
            }
         }

         // ---- Decide whether to retry ----

         // Nothing worked, and something actually went wrong.
         // Throw, so BullMQ retries the whole job.
         if (!anySucceeded && problems.length > 0) {
            throw new Error("All channels failed: " + problems.join(" | "));
         }

         // Some worked, some failed. Log the failures but do NOT retry,
         // or the parent would get duplicate alerts.
         if (problems.length > 0) {
            console.log(
               "WORKER: some channels failed but others worked ->",
               problems.join(" | "),
            );
         }

         // Nothing worked, but nothing failed either. This means the
         // parent has no token and no phone number. Retrying is pointless.
         if (!anySucceeded && problems.length === 0) {
            console.log("WORKER: no way to reach this parent yet. Not retrying.");
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
