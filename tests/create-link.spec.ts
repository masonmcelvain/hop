import { test, expect } from "@fixtures/extension";

test("new link modal is prepopulated", async ({ page }) => {
  await page.getByRole("button", { name: "Create new link" }).click();
  await expect(page.getByPlaceholder("Name")).not.toBeEmpty();
  await expect(page.getByPlaceholder("Link URL")).not.toBeEmpty();
  // The favicon URL is inaccessible for chrome-extension pages.
});

test("can create new link", async ({ page, links }) => {
  const [{ name, url, imageUrl }] = links;
  await page.getByRole("button", { name: "Create new link" }).click();

  await page.getByPlaceholder("Name").fill(name);
  await page.getByPlaceholder("Link URL").fill(url);
  await page.getByPlaceholder("Image URL").fill(imageUrl);
  await page.getByRole("button", { name: "Create", exact: true }).click();

  const link = page.getByRole("link", { name });
  await expect(link).toHaveAttribute("href", url);
  await expect(link).toHaveText(name);
  await expect(page.getByAltText(name)).toHaveAttribute("src", imageUrl);
});
