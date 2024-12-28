// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parsed: overrides } = require("dotenv").config();

module.exports = {
   "dev-chrome": {
      NODE_ENV: "development",
      TARGET: "chrome",
      ...overrides,
   },
   "dev-firefox": {
      NODE_ENV: "development",
      TARGET: "firefox",
      ...overrides,
   },
   "preview-firefox": {
      WEB_EXT_FIREFOX_PROFILE: "tmp-web-ext-profile",
      // Firefox can't connect when we save profile changes.
      // https://github.com/mozilla/web-ext/issues/932
      WEB_EXT_KEEP_PROFILE_CHANGES: false,
      WEB_EXT_PROFILE_CREATE_IF_MISSING: true,
      WEB_EXT_SOURCE_DIR: "dist/firefox",
      ...overrides,
   },
   "prod-chrome": {
      NODE_ENV: "production",
      TARGET: "chrome",
      ...overrides,
   },
   "prod-firefox": {
      NODE_ENV: "production",
      TARGET: "firefox",
      ...overrides,
   },
};
