import { test, expect } from "@fixtures/extension";
import { getIndexUrl } from "@helpers/navigation";

test.beforeAll(async ({ page, extensionId }) => {
  await page.goto(getIndexUrl(extensionId));
});

test("new link button is visible", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Create new link" })
  ).toBeVisible();
});
