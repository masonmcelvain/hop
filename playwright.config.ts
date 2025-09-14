import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
   testDir: "./tests",
   /* Maximum time (in ms) one test can run for. */
   timeout: 10000,
   expect: {
      timeout: 5000,
   },
   fullyParallel: true,
   /* Fail the build on CI if you accidentally left test.only in the source code. */
   forbidOnly: !!process.env.CI,
   /* Retry on CI only */
   retries: process.env.CI ? 2 : 0,
   workers: process.env.CI ? 2 : undefined,
   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
   reporter: "html",
   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
   use: {
      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      trace: "on-first-retry",
   },

   /* Only chromium extensions are supported by Playwright. */
   /* https://github.com/microsoft/playwright/issues/7297 */
   /* https://github.com/microsoft/playwright/issues/37017 */
   projects: [
      {
         name: "chromium",
         use: devices["Desktop Chrome"],
      },
   ],
};

export default config;
