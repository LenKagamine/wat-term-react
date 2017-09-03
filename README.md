# WatTerm (React) <img src="build/icon128.png" alt="WatTerm icon" width="32" height="32" />

**Note**: This was a React-Redux implementation of [WatTerm](https://github.com/fg123/wat-term), packaged with webpack. It is renamed to **MercuryWM** and moved to a [new repository](https://github.com/wheel-org/mercurywm).

WatTerm is a Chrome extension that transforms your new tab page into a multi-windowed terminal environment.

## Build
- `git clone https://github.com/LenKagamine/wat-term-react.git`
- `npm install`
- `npm run webpack`
  - This will also make webpack to watch for changes and rebuild on save

To build a production version, run `npm run prod`.

To run the extension, load the `build` directory into Chrome and open a new tab.

![Screenshot of WatTerm](screenshot.png)
