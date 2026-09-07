// FILE: tests/messages.test.js
// JOB: Test the wording the parent will actually read.

const { buildMessage } = require("../src/services/pushService");
const { buildEmergencyText } = require("../src/services/smsService");

// ---- Push notification wording ----

test("crying has a clear title", () => {
   const message = buildMessage({ event_type: "crying" });
   expect(message.title).toBe("Your baby is crying");
});

test("smoke is marked as an emergency in the title", () => {
   const message = buildMessage({ event_type: "smoke" });
   expect(message.title).toContain("EMERGENCY");
});

test("an unknown event still gets a title and body", () => {
   const message = buildMessage({ event_type: "something_new" });
   expect(message.title).toBeTruthy();
   expect(message.body).toBeTruthy();
});

// ---- SMS and call wording ----

test("the emergency text names the problem", () => {
   const text = buildEmergencyText({ event_type: "smoke" });
   expect(text).toContain("Smoke");
});

test("the emergency text tells the parent to check", () => {
   const text = buildEmergencyText({ event_type: "fire" });
   expect(text.toLowerCase()).toContain("check");
});

test("an unknown emergency still produces a message", () => {
   const text = buildEmergencyText({ event_type: "unknown_thing" });
   expect(text).toContain("BABY GUARDIAN EMERGENCY");
});
