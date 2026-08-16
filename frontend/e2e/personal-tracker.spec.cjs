const { test, expect } = require("@playwright/test");

test.describe("LifeOS experience", () => {
  test("opens the public homepage and enters the workspace", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Design a life that compounds/);
    await expect(
      page.getByRole("heading", { name: /Live with clarity.*Move with intent/i }),
    ).toBeVisible();

    await page.getByRole("link", { name: /Open your workspace/i }).click();
    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("keeps workspace navigation scoped under app", async ({ page }) => {
    await page.goto("/app");

    await expect(page.getByRole("link", { name: "Debt Tracker" })).toHaveAttribute(
      "href",
      "/app/debts",
    );
  });

  test("preserves legacy workspace bookmarks", async ({ page }) => {
    await page.goto("/health");

    await expect(page).toHaveURL(/\/app\/health$/);
    await expect(page.getByRole("heading", { name: "Health" })).toBeVisible();
  });
});
