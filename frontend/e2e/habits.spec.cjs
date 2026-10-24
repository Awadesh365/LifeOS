const { test, expect } = require("@playwright/test");
const email = "habits-test@example.test",
  password = "Habits-test-password-2026";
const checkbox = (page, name) =>
  page.getByRole("checkbox", { name: `Complete ${name}`, exact: true });
const button = (page, name) => page.getByRole("button", { name, exact: true });
async function login(page) {
  await page.goto("/app/habits");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await button(page, "Sign in").click();
  await expect(
    page.getByRole("heading", { name: "Daily Tracker" }),
  ).toBeVisible();
}
async function add(page, name) {
  await button(page, "Add habit").click();
  await page.getByRole("dialog").getByLabel("Name", { exact: true }).fill(name);
  await button(page, "Save habit").click();
  await expect(checkbox(page, name)).toBeVisible();
}
test("web CRUD, date history and failed-save recovery", async ({ page }) => {
  await login(page);
  await expect(
    page.getByText("No habits yet.", { exact: false }),
  ).toBeVisible();
  await button(page, "Add habit").click();
  await page
    .getByRole("dialog")
    .getByLabel("Name", { exact: true })
    .fill("Browser practice");
  await page.route("**/api/habits", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({
          status: 503,
          contentType: "application/json",
          body: '{"error":"Test save unavailable"}',
        })
      : route.continue(),
  );
  await button(page, "Save habit").click();
  await expect(
    page.getByRole("dialog").getByText("Test save unavailable"),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog").getByLabel("Name", { exact: true }),
  ).toHaveValue("Browser practice");
  await page.unroute("**/api/habits");
  await button(page, "Save habit").click();
  await checkbox(page, "Browser practice").check();
  await expect(page.getByText("1 of 1 complete · 100%")).toBeVisible();
  await page.reload();
  await expect(checkbox(page, "Browser practice")).toBeChecked();
  await page.getByLabel("Habit date").fill("2024-02-29");
  await expect(checkbox(page, "Browser practice")).not.toBeChecked();
  await checkbox(page, "Browser practice").check();
  await expect(page.getByText("1 of 1 complete · 100%")).toBeVisible();
  await button(page, "Edit Browser practice").click();
  await page
    .getByRole("dialog")
    .getByLabel("Name", { exact: true })
    .fill("Edited browser practice");
  await button(page, "Save habit").click();
  await expect(checkbox(page, "Edited browser practice")).toBeChecked();
  await button(page, "Reset day").click();
  await expect(checkbox(page, "Edited browser practice")).not.toBeChecked();
  await button(page, "Delete Edited browser practice").click();
  await button(page, "Delete permanently").click();
  await expect(
    page.getByText("No habits yet.", { exact: false }),
  ).toBeVisible();
  await page.route("**/api/habits/week?*", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: '{"error":"Test load unavailable"}',
    }),
  );
  await button(page, "Refresh").click();
  await expect(page.getByText("Test load unavailable")).toBeVisible();
  await page.unroute("**/api/habits/week?*");
  await button(page, "Retry").click();
  await expect(
    page.getByText("No habits yet.", { exact: false }),
  ).toBeVisible();
});
test("web and Expo mobile share edits and history after refresh", async ({
  page,
  browser,
}) => {
  test.skip(
    !process.env.HABITS_MOBILE_URL,
    "Set HABITS_MOBILE_URL to the Expo web instance backed by the disposable API.",
  );
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    timezoneId: "Asia/Kolkata",
  });
  const mobile = await context.newPage();
  try {
    await login(page);
    await add(page, "Cross client practice");
    await mobile.goto(process.env.HABITS_MOBILE_URL + "/habits");
    await mobile.locator('input[autocomplete="email"]').fill(email);
    await mobile.locator('input[type="password"]').fill(password);
    await mobile.getByText("Sign in", { exact: true }).last().click();
    await expect(
      mobile.getByText("Your day, clearly.", { exact: true }),
    ).toBeVisible();
    await mobile.goto(process.env.HABITS_MOBILE_URL + "/habits");
    await expect(checkbox(mobile, "Cross client practice")).toBeVisible();
    await button(mobile, "Edit Cross client practice").click();
    await mobile.getByLabel("name", { exact: true }).fill("Edited on mobile");
    await button(mobile, "Save habit").click();
    await checkbox(mobile, "Edited on mobile").click();
    await expect(checkbox(mobile, "Edited on mobile")).toBeChecked();
    await page.reload();
    await expect(checkbox(page, "Edited on mobile")).toBeChecked();
    await checkbox(page, "Edited on mobile").uncheck();
    await expect(page.getByText("0 of 1 complete · 0%")).toBeVisible();
    await mobile.reload();
    await expect(checkbox(mobile, "Edited on mobile")).not.toBeChecked();
    await button(mobile, "Previous day").click();
    await checkbox(mobile, "Edited on mobile").click();
    await expect(checkbox(mobile, "Edited on mobile")).toBeChecked();
    await button(page, "Previous day").click();
    await expect(checkbox(page, "Edited on mobile")).toBeChecked();
    await button(mobile, "Delete Edited on mobile").click();
    await button(mobile, "Delete permanently").click();
    await expect(
      mobile.getByText("Build your rhythm", { exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByText("No habits yet.", { exact: false }),
    ).toBeVisible();
    await button(mobile, "Add habit").click();
    await mobile.getByLabel("name", { exact: true }).fill("Created on mobile");
    await mobile.route("**/api/habits", (route) =>
      route.request().method() === "POST"
        ? route.fulfill({
            status: 503,
            contentType: "application/json",
            body: '{"error":"Mobile save unavailable"}',
          })
        : route.continue(),
    );
    await button(mobile, "Save habit").click();
    await expect(
      mobile.getByText("Mobile save unavailable", { exact: true }).last(),
    ).toBeVisible();
    await expect(mobile.getByLabel("name", { exact: true })).toHaveValue(
      "Created on mobile",
    );
    await mobile.unroute("**/api/habits");
    await button(mobile, "Save habit").click();
    await expect(checkbox(mobile, "Created on mobile")).toBeVisible();
    await page.reload();
    await expect(checkbox(page, "Created on mobile")).toBeVisible();
    await button(page, "Edit Created on mobile").click();
    await page
      .getByRole("dialog")
      .getByLabel("Category", { exact: true })
      .fill("Shared category");
    await button(page, "Save habit").click();
    await expect(page.getByText("Habit saved.", { exact: true })).toBeVisible();
    await button(mobile, "Refresh").click();
    await expect(
      mobile.getByText("Shared category", { exact: true }),
    ).toBeVisible();
    await mobile.route("**/api/habits/*/completion", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: '{"error":"Completion unavailable"}',
      }),
    );
    await checkbox(mobile, "Created on mobile").click();
    await expect(
      mobile.getByText("Completion unavailable", { exact: true }),
    ).toBeVisible();
    await expect(checkbox(mobile, "Created on mobile")).not.toBeChecked();
    await mobile.unroute("**/api/habits/*/completion");
    await checkbox(mobile, "Created on mobile").click();
    await expect(checkbox(mobile, "Created on mobile")).toBeChecked();
    await button(page, "Delete Created on mobile").click();
    await button(page, "Delete permanently").click();
    await expect(
      page.getByText("No habits yet.", { exact: false }),
    ).toBeVisible();
    await button(mobile, "Refresh").click();
    await expect(
      mobile.getByText("Build your rhythm", { exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("an open web tracker follows local midnight without moving yesterday’s completion", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-09-08T18:29:50Z") });
  await login(page);
  await add(page, "Midnight practice");
  await checkbox(page, "Midnight practice").check();
  await expect(page.getByText("1 of 1 complete · 100%")).toBeVisible();
  await page.clock.runFor(31000);
  await expect(page.getByLabel("Habit date")).toHaveValue("2026-09-09");
  await expect(checkbox(page, "Midnight practice")).not.toBeChecked();
  await button(page, "Previous day").click();
  await expect(checkbox(page, "Midnight practice")).toBeChecked();
  await button(page, "Delete Midnight practice").click();
  await button(page, "Delete permanently").click();
  await expect(
    page.getByText("No habits yet.", { exact: false }),
  ).toBeVisible();
});
