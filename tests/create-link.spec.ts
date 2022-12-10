import { test, expect } from "@fixtures/extension";

const linkName = "Hop";
const linkUrl = "https://github.com/masonmcelvain/hop";
const imageUrl =
  "https://user-images.githubusercontent.com/52104630/138492652-531cc551-f07c-4e63-9146-3c9352d34847.png";

test("can create new link", async ({ page }) => {
  await page.getByRole("button", { name: "Create new link" }).click();

  await page.getByPlaceholder("Name").fill(linkName);
  await page.getByPlaceholder("Link URL").fill(linkUrl);
  await page.getByPlaceholder("Image URL").fill(imageUrl);
  await page.getByRole("button", { name: "Create", exact: true }).click();

  const link = page.getByRole("link", { name: linkName });
  await expect(link).toHaveAttribute("href", linkUrl);
  await expect(link).toHaveText(linkName);
  await expect(page.getByAltText(linkName)).toHaveAttribute("src", imageUrl);
});
