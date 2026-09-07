// FILE: tests/quietHours.test.js
// JOB: Test the time logic, especially the midnight wrap-around.

const { isQuietHour, isQuietTime } = require("../src/services/quietHours");

// ---- A normal window that does not cross midnight: 1 to 5 ----

test("inside a normal window is quiet", () => {
   expect(isQuietHour(3, 1, 5)).toBe(true);
});

test("outside a normal window is not quiet", () => {
   expect(isQuietHour(9, 1, 5)).toBe(false);
});

test("the end hour itself is not quiet", () => {
   expect(isQuietHour(5, 1, 5)).toBe(false);
});

// ---- A window that crosses midnight: 22 to 6 ----

test("late evening is quiet", () => {
   expect(isQuietHour(23, 22, 6)).toBe(true);
});

test("after midnight is still quiet", () => {
   expect(isQuietHour(2, 22, 6)).toBe(true);
});

test("the start hour itself is quiet", () => {
   expect(isQuietHour(22, 22, 6)).toBe(true);
});

test("morning is not quiet", () => {
   expect(isQuietHour(9, 22, 6)).toBe(false);
});

test("afternoon is not quiet", () => {
   expect(isQuietHour(15, 22, 6)).toBe(false);
});

// ---- The settings wrapper ----

test("quiet hours turned off means never quiet", () => {
   const settings = { quiet_hours_enabled: false, quiet_start: 22, quiet_end: 6 };
   expect(isQuietTime(settings, 2)).toBe(false);
});

test("quiet hours turned on works", () => {
   const settings = { quiet_hours_enabled: true, quiet_start: 22, quiet_end: 6 };
   expect(isQuietTime(settings, 2)).toBe(true);
});

test("missing settings means not quiet, which is safer", () => {
   expect(isQuietTime(null, 2)).toBe(false);
});
