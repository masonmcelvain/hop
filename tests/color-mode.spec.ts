import { test, expect } from "@fixtures/extension";

test("default color mode is dark", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass("chakra-ui-dark");
});

test("color mode changes are persisted", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle color mode" }).click();
  await expect(page.locator("body")).toHaveClass("chakra-ui-light");
  await page.reload();
  await expect(page.locator("body")).toHaveClass("chakra-ui-light");
});
