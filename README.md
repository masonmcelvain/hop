<img align="right" width="256px" height="256px" alt="Hop logo" src="https://user-images.githubusercontent.com/52104630/138492652-531cc551-f07c-4e63-9146-3c9352d34847.png" />

# Hop

[link-chrome]: https://chrome.google.com/webstore/detail/hop/djdlkcbfbdebfaoakhnoienanaakgccd "Version published on Chrome Web Store"
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/hop/ "Version published on Mozilla Add-ons"

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/djdlkcbfbdebfaoakhnoienanaakgccd.svg?label=%20">][link-chrome]
[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/firefox/firefox.svg" width="48" alt="Firefox" valign="middle">][link-firefox] [<img valign="middle" src="https://img.shields.io/amo/v/hop.svg?label=%20">][link-firefox]

Hop is a browser extension that stores links to your favorite sites in a more visually pleasing way than traditional bookmarks. Hop will try to find an icon for each link automatically, but you can use your own image if you prefer.

It's available for use on the [Chrome Web Store](https://chrome.google.com/webstore/detail/hop/djdlkcbfbdebfaoakhnoienanaakgccd) and as a [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/hop/).

## Opening Issues 🥕

[![Playwright Tests](https://github.com/masonmcelvain/hop/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/masonmcelvain/hop/actions/workflows/playwright.yml)
[![Type Check](https://github.com/masonmcelvain/hop/actions/workflows/tsc.yml/badge.svg)](https://github.com/masonmcelvain/hop/actions/workflows/tsc.yml)
[![Lint](https://github.com/masonmcelvain/hop/actions/workflows/lint.yml/badge.svg)](https://github.com/masonmcelvain/hop/actions/workflows/lint.yml)
[![CodeQL](https://github.com/masonmcelvain/hop/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/masonmcelvain/hop/actions/workflows/codeql-analysis.yml)

If you'd like to see a new feature or you've spotted a bug, please check to see if there are any [closed issues](https://github.com/masonmcelvain/hop/issues?q=is%3Aissue+is%3Aclosed) that might address your concern before opening a new issue on this repository.

## Contributing 🐰

If there's an issue you'd like to tackle, please fork this repository, make your changes in a series of well documented commits, and open a pull request. I appreciate your interest in contributing to this project.

### Installation

-  Clone the repository and navigate to it's root directory with `git clone https://github.com/masonmcelvain/hop.git && cd hop`
-  Install dependencies with `pnpm install`
   -  You'll need version 16 of [Node.js](https://nodejs.org/en/download/) installed, and `pnpm` version 7.

### Running a dev server

-  Start a development server with `pnpm dev:chrome` or `pnpm dev:firefox`.
-  Special Chrome instructions:
   -  Navigate to `chrome://extensions` in your browser. You can also access this page by clicking on the Chrome menu on the top right side of the Omnibox, hovering over More Tools and selecting Extensions.
   -  Check the box next to Developer Mode.
   -  Click Load Unpacked Extension and select the `dist/chrome` directory in the top level directory of this repository.
-  Special Firefox instructions:
   -  You can preview the extension with `pnpm preview:firefox`.
   -  To install the extension manually:
      -  Visit `about:debugging#/runtime/this-firefox`.
      -  Click "Load Temporary Add-on..."
      -  Select the generated `firefox.zip` file. The extension should now be installed.
-  Open the extension in your browser to see the app.
   -  Note: When you make code changes, you most close the extension popup (i.e. click anything but the extension window) and re-open it to see those changes reflected.

### Environment Variables

-  No additional environment variables are need to develop or build the app. Should you need to add or override any though, place them in a `.env` file and they will be automatically loaded into package scripts.

### Running tests

-  Run [Playwright tests](https://playwright.dev/docs/intro) with `pnpm test`.

### Building for production

-  Run `pnpm build`, which will output minified projects in `dist/chrome`, `dist/firefox`, and zipped projects in `dist/chrome.zip` and `dist/firefox.zip`.
