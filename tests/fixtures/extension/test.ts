import { test as base, chromium, BrowserContext, Page } from "@playwright/test";
import path from "path";
import links from "./data/links.json";

export const test = base.extend<{
   context: BrowserContext;
   extensionId: string;
   page: Page;
   links: typeof links;
   pageWithOneLink: Page;
   pageWithLinks: Page;
}>({
   context: async ({}, use) => {
      const pathToExtension = path.join(__dirname, "../../../dist/chrome");
      const context = await chromium.launchPersistentContext("", {
         headless: false,
         args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
         ],
      });
      await use(context);
      await context.close();
   },
   extensionId: async ({ context }, use) => {
      const page = await context.newPage();
      await page.goto("chrome://extensions/");
      await page.click("#detailsButton");
      const extensionId = page.url().split("?id=")[1];
      await page.close();
      await use(extensionId);
   },
   page: async ({ context, extensionId }, use) => {
      const [page] = context.pages();
      await page.goto(extensionUrl(extensionId));
      await use(page);
   },
   links: async ({}, use) => {
      await use(links);
   },
   pageWithOneLink: async ({ context, extensionId, links }, use) => {
      const [page] = context.pages();
      await page.goto(extensionUrl(extensionId));
      await addLink(page, links[0]);
      await use(page);
   },
   pageWithLinks: async ({ context, extensionId, links }, use) => {
      const [page] = context.pages();
      await page.goto(extensionUrl(extensionId));
      for (const link of links) {
         await addLink(page, link);
      }
      await use(page);
   },
});
export const expect = test.expect;

async function addLink(page: Page, link: (typeof links)[0]) {
   await page.getByRole("button", { name: "Create new link" }).click();
   await page.getByPlaceholder("Name").fill(link.name);
   await page.getByPlaceholder("Link URL").fill(link.url);
   await page.getByPlaceholder("Image URL").fill(link.imageUrl);
   await page.getByRole("button", { name: "Create", exact: true }).click();
}

function extensionUrl(extensionId: string) {
   return `chrome-extension://${extensionId}/index.html`;
}
