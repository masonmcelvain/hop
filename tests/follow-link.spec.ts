import { test, expect } from "@fixtures/extension";

test("can open link in new tab", async ({
   context,
   links,
   pageWithOneLink: page,
}) => {
   const [{ url }] = links;
   const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page
         .getByRole("link")
         .first()
         .click({ modifiers: ["Control"] }),
   ]);
   expect(newPage.url()).toBe(url);
});
