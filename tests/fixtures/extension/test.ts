import { test as base, chromium, BrowserContext, Page } from "@playwright/test";
import path from "path";
import links from "./data/links.json";

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  page: Page;
  links: typeof links;
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
    await page.getByRole("button", { name: "Details" }).click();
    const extensionId = page.url().split("?id=")[1];
    await page.close();
    await use(extensionId);
  },
  page: async ({ context, extensionId }, use) => {
    const [page] = context.pages();
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await use(page);
  },
  links: async ({}, use) => {
    await use(links);
  },
  pageWithLinks: async ({ context, extensionId, links }, use) => {
    const [page] = context.pages();
    await page.goto(`chrome-extension://${extensionId}/index.html`);

    for (const { name, url, imageUrl } of links) {
      await page.getByRole("button", { name: "Create new link" }).click();
      await page.getByPlaceholder("Name").fill(name);
      await page.getByPlaceholder("Link URL").fill(url);
      await page.getByPlaceholder("Image URL").fill(imageUrl);
      await page.getByRole("button", { name: "Create", exact: true }).click();
    }

    await use(page);
  },
});
export const expect = test.expect;
