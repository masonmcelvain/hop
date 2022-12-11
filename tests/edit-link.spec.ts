import { test, expect } from "@fixtures/extension";

const name = "React DnD";
const url = "https://react-dnd.github.io/react-dnd/about";
const imageUrl =
  "https://react-dnd.github.io/react-dnd/favicon-32x32.png?v=b4e3a877490f33e678d9e30b115e75c3";

test("can edit link", async ({ pageWithLinks: page }) => {
  await page.getByRole("button", { name: "Edit links" }).click();
  await page.getByRole("button", { name: "Edit this link" }).first().click();

  const nameInput = page.getByPlaceholder("Name");
  await nameInput.fill("");
  await nameInput.fill(name);
  const urlInput = page.getByPlaceholder("Link URL");
  await urlInput.fill("");
  await urlInput.fill(url);
  const imageUrlInput = page.getByPlaceholder("Image URL");
  await imageUrlInput.fill("");
  await imageUrlInput.fill(imageUrl);
  await page.getByRole("button", { name: "Update" }).click();

  const link = page.getByRole("link", { name });
  await expect(link).toHaveAttribute("href", url);
  await expect(link).toHaveText(name);
  await expect(page.getByAltText(name)).toHaveAttribute("src", imageUrl);
});
