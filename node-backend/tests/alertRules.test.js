// FILE: tests/alertRules.test.js
// JOB: Test the alert rules. Run with: npm test

const { decideAlert } = require("../src/services/alertService");

test("an emergency always sends, even during quiet hours", () => {
   const event = { event_type: "smoke", severity: "emergency" };
   const actions = decideAlert(event, true); // true means it IS quiet time
   expect(actions.sendEmergency).toBe(true);
   expect(actions.silenced).toBe(false);
});

test("a warning sends a notification when it is not quiet", () => {
   const event = { event_type: "crying", severity: "warning" };
   const actions = decideAlert(event, false);
   expect(actions.sendNotification).toBe(true);
   expect(actions.sendEmergency).toBe(false);
});

test("a warning is silenced during quiet hours", () => {
   const event = { event_type: "crying", severity: "warning" };
   const actions = decideAlert(event, true);
   expect(actions.sendNotification).toBe(false);
   expect(actions.silenced).toBe(true);
});

test("an info event sends nothing", () => {
   const event = { event_type: "motion", severity: "info" };
   const actions = decideAlert(event, false);
   expect(actions.sendNotification).toBe(false);
   expect(actions.sendEmergency).toBe(false);
});

test("an unknown severity is treated quietly", () => {
   const event = { event_type: "mystery", severity: "banana" };
   const actions = decideAlert(event, false);
   expect(actions.sendEmergency).toBe(false);
   expect(actions.sendNotification).toBe(false);
});
