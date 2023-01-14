import { test, expect } from "@fixtures/extension";

test("new link button is visible", async ({ page }) => {
   await expect(
      page.getByRole("button", { name: "Create new link" })
   ).toBeVisible();
});
