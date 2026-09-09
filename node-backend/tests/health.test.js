// FILE: tests/health.test.js
// JOB: Test the logic that decides the overall system state.

const { overallStatus } = require("../src/services/healthService");

test("everything up means the system is up", () => {
   const checks = [
      { name: "database", status: "up", required: true },
      { name: "redis", status: "up", required: true },
   ];
   expect(overallStatus(checks)).toBe("up");
});

test("a required piece down means the system is down", () => {
   const checks = [
      { name: "database", status: "down", required: true },
      { name: "redis", status: "up", required: true },
   ];
   expect(overallStatus(checks)).toBe("down");
});

test("an optional piece down means degraded, not down", () => {
   const checks = [
      { name: "database", status: "up", required: true },
      { name: "ai_models", status: "down", required: false },
   ];
   expect(overallStatus(checks)).toBe("degraded");
});

test("down beats degraded", () => {
   // If one thing is degraded and another required thing is down,
   // the answer must be down. The worst state wins.
   const checks = [
      { name: "python", status: "degraded", required: true },
      { name: "database", status: "down", required: true },
   ];
   expect(overallStatus(checks)).toBe("down");
});

test("a degraded piece makes the system degraded", () => {
   const checks = [
      { name: "database", status: "up", required: true },
      { name: "python", status: "degraded", required: true },
   ];
   expect(overallStatus(checks)).toBe("degraded");
});

test("no checks at all means up", () => {
   // An empty list should not crash.
   expect(overallStatus([])).toBe("up");
});
