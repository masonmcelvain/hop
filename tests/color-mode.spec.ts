import { test, expect } from "@fixtures/extension";

test("default color mode is dark", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass("chakra-ui-dark");
});
