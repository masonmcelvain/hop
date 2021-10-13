# Hop

Hop is a Chrome extension that stores links to your favorite sites in a more visually pleasing way than traditional browser bookmarks. Hop will try to find an icon for each link automatically, but you can use your own image if you prefer.

It's available for use on the [Chrome Web Store](https://chrome.google.com/webstore/detail/hop/djdlkcbfbdebfaoakhnoienanaakgccd).

## Opening Issues
If you'd like to see a new feature or you've spotted a bug, please check to see if there are any [closed issues](https://github.com/masonmcelvain/hop/issues?q=is%3Aissue+is%3Aclosed) that might address your concern before opening a new issue on this repository.

## Contributing
If there's an issue you're interested in tackling, please fork this repository, make your changes in a series of well documented commits, and open a pull request. I really appreciate your willingness to contribute to this project 🙂

### Develop Locally
* Clone the repository and navigate to it's root directory with `git clone https://github.com/masonmcelvain/hop.git && cd hop`
* Install dependencies with `npm install`
  * You'll need a recent version of [Node.js](https://nodejs.org/en/download/) installed.
* Load the extension into your browser.
  * Navigate to `chrome://extensions` in your browser. You can also access this page by clicking on the Chrome menu on the top right side of the Omnibox, hovering over More Tools and selecting Extensions.
  * Check the box next to Developer Mode.
  * Click Load Unpacked Extension and select the `build` directory in the top level directory of this repository.
* Start a development server with `npm run dev`.
* Open the extension in your browser to see the app.
  * Note: When you make code changes, you most close the extension popup (i.e. click anything but the extension window) and re-open it to see those changes reflected.
* Have fun 🥳
