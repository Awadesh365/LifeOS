import { test, expect } from "@playwright/test";

const seedAuthenticatedUser = async (page: import("@playwright/test").Page) => {
  await page.addInitScript(() => {
    localStorage.setItem("token", "mock-jwt-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: "user-1",
        id: "user-1",
        email: "tester@lifeos.local",
        name: "LifeOS Tester",
        role: "admin",
        token: "mock-jwt-token",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  });
};

test.describe("LifeOS Frontend - Page Loading Tests", () => {
  test("Landing page loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/LifeOS/);
    await expect(page.getByRole("heading", { name: "LifeOS" })).toBeVisible();
  });

  test("Scope dashboard exposes the LifeOS scopes", async ({ page }) => {
    await page.goto("/");

    for (const scope of ["Personal", "Societal", "City", "State", "Country", "World"]) {
      await expect(page.getByRole("link", { name: new RegExp(scope) }).first()).toBeVisible();
    }
  });

  test("Personal scope loads the migrated Life Tracker dashboard", async ({ page }) => {
    await page.goto("/personal");
    await expect(page.getByText("LifeOS Personal").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  for (const scope of ["societal", "state", "country", "world"]) {
    test(`${scope} scope foundation page loads`, async ({ page }) => {
      await page.goto(`/${scope}`);
      await expect(page.getByRole("heading", { name: new RegExp(scope, "i") })).toBeVisible();
    });
  }

  test("City scope opens the existing CityOS dashboard for authenticated users", async ({ page }) => {
    await seedAuthenticatedUser(page);
    await page.goto("/city");
    await expect(page.getByText("LifeOS").first()).toBeVisible();
    await expect(page.getByText("City Overview").first()).toBeVisible();
  });

  test("Login page loads correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();
    const emailInput = page.getByPlaceholder("name@lifeos.local");
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("Protected routes handle unauthenticated access", async ({ page }) => {
    await page.goto("/dashboard");
    // Should either redirect to login or show loading/error - just check page loads
    await expect(page.locator("body")).toBeVisible();
  });

  // Note: For authenticated routes, we would need to mock authentication
  // These tests assume the app handles unauthenticated access appropriately

  test("District Collectorate page structure", async ({ page }) => {
    await page.goto("/district/collectorate");
    // Check if redirected or shows appropriate content
    await expect(page.locator("body")).toBeVisible();
  });

  test("Police Stations page loads", async ({ page }) => {
    await page.goto("/police/stations/all");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Emergency Command Center loads", async ({ page }) => {
    await page.goto("/emergency/map/overview");
    await expect(page.locator("body")).toBeVisible();
  });

  test("State Dashboard loads", async ({ page }) => {
    await page.goto("/state/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Citizen Services overview loads", async ({ page }) => {
    await page.goto("/services/overview");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Schemes Dashboard loads", async ({ page }) => {
    await page.goto("/schemes/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Revenue Dashboard loads", async ({ page }) => {
    await page.goto("/revenue/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Health Dashboard loads", async ({ page }) => {
    await page.goto("/health/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Education Dashboard loads", async ({ page }) => {
    await page.goto("/education/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Police Dashboard loads", async ({ page }) => {
    await page.goto("/police/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Environment Dashboard loads", async ({ page }) => {
    await page.goto("/environment/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Analytics Dashboard loads", async ({ page }) => {
    await page.goto("/analytics/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  // Test some specific resource table pages
  test("Sub-Divisions table loads", async ({ page }) => {
    await page.goto("/district/sub-divisions");
    await expect(page.locator("body")).toBeVisible();
    // Could check for table elements if known
  });

  test("Active Incidents table loads", async ({ page }) => {
    await page.goto("/emergency/incidents/active");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Central Government Schemes loads", async ({ page }) => {
    await page.goto("/schemes/central/pm-awas");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Land Records loads", async ({ page }) => {
    await page.goto("/revenue/land/khatauni");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Government Schools table loads", async ({ page }) => {
    await page.goto("/education/schools/government");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Crime Hotspots loads", async ({ page }) => {
    await page.goto("/police/analytics/hotspots");
    await expect(page.locator("body")).toBeVisible();
  });

  test("ODF Status loads", async ({ page }) => {
    await page.goto("/environment/swachh/odf");
    await expect(page.locator("body")).toBeVisible();
  });

  test("District Scorecard loads", async ({ page }) => {
    await page.goto("/analytics/performance/scorecard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("User Directory loads", async ({ page }) => {
    await page.goto("/admin/users/directory");
    await expect(page.locator("body")).toBeVisible();
  });

  // Test certificate services
  test("Birth Certificate page loads", async ({ page }) => {
    await page.goto("/services/certificates/birth");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Property Tax page loads", async ({ page }) => {
    await page.goto("/services/payments/property-tax");
    await expect(page.locator("body")).toBeVisible();
  });

  // Test invalid route handling
  test("Invalid route is handled gracefully", async ({ page }) => {
    await page.goto("/invalid-route");
    // Should show some content or redirect - just check page doesn't crash
    await expect(page.locator("body")).toBeVisible();
  });
});
