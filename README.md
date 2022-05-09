<img align="right" width="256px" height="256px" alt="Hop logo" src="https://user-images.githubusercontent.com/52104630/138492652-531cc551-f07c-4e63-9146-3c9352d34847.png" />

# Hop

[link-chrome]: https://chrome.google.com/webstore/detail/hop/djdlkcbfbdebfaoakhnoienanaakgccd 'Version published on Chrome Web Store'
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/hop/ 'Version published on Mozilla Add-ons'

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/lmjdlojahmbbcodnpecnjnmlddbkjhnn.svg?label=%20">][link-chrome]
[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/firefox/firefox.svg" width="48" alt="Firefox" valign="middle">][link-firefox] [<img valign="middle" src="https://img.shields.io/amo/v/notifier-for-github.svg?label=%20">][link-firefox]

Hop is a browser extension that stores links to your favorite sites in a more visually pleasing way than traditional bookmarks. Hop will try to find an icon for each link automatically, but you can use your own image if you prefer.

It's available for use on the [Chrome Web Store](https://chrome.google.com/webstore/detail/hop/djdlkcbfbdebfaoakhnoienanaakgccd) and as a [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/hop/).

## Opening Issues 🥕

[![CodeQL](https://github.com/masonmcelvain/hop/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/masonmcelvain/hop/actions/workflows/codeql-analysis.yml)
[![Lint](https://github.com/masonmcelvain/hop/actions/workflows/lint.yml/badge.svg)](https://github.com/masonmcelvain/hop/actions/workflows/lint.yml)

If you'd like to see a new feature or you've spotted a bug, please check to see if there are any [closed issues](https://github.com/masonmcelvain/hop/issues?q=is%3Aissue+is%3Aclosed) that might address your concern before opening a new issue on this repository.

## Contributing 🐰
If there's an issue you'd like to tackle, please fork this repository, make your changes in a series of well documented commits, and open a pull request. I appreciate your interest in contributing to this project.

### Develop Locally
* Clone the repository and navigate to it's root directory with `git clone https://github.com/masonmcelvain/hop.git && cd hop`
* Install dependencies with `npm install`
  * You'll need version 16 of [Node.js](https://nodejs.org/en/download/) installed, and `npm` version 8. I recommend using [`nvm`](https://github.com/nvm-sh/nvm) to switch between versions quickly.
* Start a development server with `npm run start:chrome` or `npm run start:firefox`.
* Special Chrome instructions:
  * Navigate to `chrome://extensions` in your browser. You can also access this page by clicking on the Chrome menu on the top right side of the Omnibox, hovering over More Tools and selecting Extensions.
  * Check the box next to Developer Mode.
  * Click Load Unpacked Extension and select the `dist` directory in the top level directory of this repository.
* Open the extension in your browser to see the app.
  * Note: When you make code changes, you most close the extension popup (i.e. click anything but the extension window) and re-open it to see those changes reflected.
* Have fun!

### Building for Production
* Run `npm run build`, which will output minified projects in `dist/chrome`, `dist/firefox`, and zipped projects in `dist/zip/chrome.zip` and `dist/zip/firefox.zip`.
