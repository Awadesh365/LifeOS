const { defineConfig } = require("@playwright/test");
for (const key of ["GTK_PATH", "GIO_MODULE_DIR", "LOCPATH", "FONTCONFIG_PATH"])
  delete process.env[key];
module.exports = defineConfig({
  testDir: "./e2e",
  testMatch: "habits.spec.cjs",
  timeout: 120000,
  workers: 1,
  reporter: "list",
  use: {
    browserName: "chromium",
    baseURL: process.env.HABITS_WEB_URL || "http://localhost:55441",
    timezoneId: "Asia/Kolkata",
    screenshot: "only-on-failure",
  },
});
