import { test, expect } from "@fixtures/extension";

test("can delete link", async ({ links, pageWithLinks: page }) => {
   const [_, { name: secondLinkName }] = links;

   await page.getByRole("button", { name: "Edit links" }).click();
   await page.getByRole("button", { name: "Delete this link" }).first().click();

   const newLinks = page.getByRole("link");
   expect(await newLinks.count()).toBe(links.length - 1);
   await expect(newLinks.first()).toHaveText(secondLinkName);
});
