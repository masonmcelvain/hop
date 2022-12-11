import { test, expect } from "@fixtures/extension";

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
