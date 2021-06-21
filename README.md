# Launchpad

Launchpad is a Chrome extension that lets you navigate webpages in a more visually pleasing way than traditional bookmarks. The primary feature is silky smooth drag & drop to sort your links.

## Contributing
The extension is still under development, but when its on the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions) and I'm ready to accept contributions, I'll detail the process here.

### Develop Locally
* Clone with `https://github.com/masonmcelvain/launchpad-chrome-extension.git`.
* Navigate to `cd launchpad-chrome-extension`.
* Install dependencies with `npm install`.
  * You'll need a recent version of [Node.js](https://nodejs.org/en/download/) installed.
* Load the extension into your browser.
  * Navigate to `chrome://extensions` in your browser. You can also access this page by clicking on the Chrome menu on the top right side of the Omnibox, hovering over More Tools and selecting Extensions.
  * Check the box next to Developer Mode.
  * Click Load Unpacked Extension and select the directory for the "Launchpad" extension.
* Start a development server with `npm run dev`.
* Open the extension in your browser to see the app.
  * Note: When you make code changes, you most close the extension popup (i.e. click anything but the extension window) and re-open it to see those changes reflected.
* Happy hacking!
