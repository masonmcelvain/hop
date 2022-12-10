import { test as base, chromium, BrowserContext, Page } from "@playwright/test";
import path from "path";

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  page: Page;
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
    await use(extensionId);
  },
  page: async ({ extensionId, page }, use) => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await use(page);
  },
});
export const expect = test.expect;
