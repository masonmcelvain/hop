import { test, expect } from "@fixtures/extension";

test("can open link in new tab", async ({
   context,
   links,
   pageWithOneLink: page,
}) => {
   const [{ url }] = links;
   await page.keyboard.down("Control");
   const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.keyboard.down("Digit1"),
   ]);
   expect(newPage.url()).toBe(url);
});

test("can create new link", async ({ page, links }) => {
   const [{ name, url, imageUrl }] = links;
   await page.keyboard.down("n");

   await page.getByPlaceholder("Name").fill(name);
   await page.getByPlaceholder("Link URL").fill(url);
   await page.getByPlaceholder("Image URL").fill(imageUrl);
   await page.getByRole("button", { name: "Create", exact: true }).click();

   const link = page.getByRole("link", { name });
   await expect(link).toHaveAttribute("href", url);
   await expect(link).toHaveText(name);
   await expect(page.getByAltText(name)).toHaveAttribute("src", imageUrl);
});

test("can edit link", async ({ pageWithOneLink: page }) => {
   const name = "React DnD";
   const url = "https://react-dnd.github.io/react-dnd/about";
   const imageUrl =
      "https://react-dnd.github.io/react-dnd/favicon-32x32.png?v=b4e3a877490f33e678d9e30b115e75c3";

   await page.keyboard.down("e");
   await page.keyboard.down("Digit1");

   await page.getByPlaceholder("Name").fill(name);
   await page.getByPlaceholder("Link URL").fill(url);
   await page.getByPlaceholder("Image URL").fill(imageUrl);
   await page.getByRole("button", { name: "Update" }).click();

   const link = page.getByRole("link");
   await expect(link).toHaveAttribute("href", url);
   await expect(link).toHaveText(name);
   await expect(page.getByAltText(name)).toHaveAttribute("src", imageUrl);
});

test("can escape new link modal", async ({ page }) => {
   await page.keyboard.down("n");
   await page.keyboard.down("Escape");
   await expect(
      page.getByRole("button", { name: "Create new link" }),
   ).toBeVisible();
});

test("can escape edit link modal", async ({ page }) => {
   await page.keyboard.down("e");
   await page.keyboard.down("Escape");
   await expect(
      page.getByRole("button", { name: "Create new link" }),
   ).toBeVisible();
});
