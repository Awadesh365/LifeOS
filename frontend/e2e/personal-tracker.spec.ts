import { test, expect } from "@playwright/test";

test.describe("LifeOS Personal Tracker", () => {
  test("opens the Personal dashboard directly", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/LifeOS - Personal Tracker/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Personal Tracker")).toBeVisible();
    await expect(page.getByText("Scope Switcher")).toHaveCount(0);
  });

  test("uses root routes for Personal tracker navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Debt Tracker" })).toHaveAttribute(
      "href",
      "/debts",
    );
  });

  test("old non-Personal scope URLs are not exposed", async ({ page }) => {
    await page.goto("/city");

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});
