const aria = {
  current: 'aria-current',
  currentLocation: 'location',
  currentPage: 'page',
};

const hrefToRootAbsolutePath = (selector) => {
  const absolutePath =
    selector instanceof HTMLElement ? selector.href : selector.href.baseVal;
  const windowLocation = window.location;
  const protocolHost = `${windowLocation.protocol}//${windowLocation.host}`;

  return absolutePath.replace(protocolHost, '').replace(/index\.html$/, '');
};

const rootAbsolutePathToArray = (absolutePath) => {
  return absolutePath
    .replace(/\\/g, '/')
    .replace(/\/[^/]*$/, '')
    .slice(1)
    .split('/');
};

const setCurrentLocation = (selectors, level) => {
  Array.from(document.querySelectorAll(selectors)).forEach((selector) => {
    const paths = rootAbsolutePathToArray(hrefToRootAbsolutePath(selector));
    const matchedPath = paths.map((path, index) => {
      if (index <= level - 1) {
        return `${path}/`;
      }
      return null;
    });

    const directories = rootAbsolutePathToArray(window.location.pathname);
    const matchedDirectory = directories.map((directory, index) => {
      if (index <= level - 1) {
        return `${directory}/`;
      }
      return null;
    });

    const directory = `/${matchedDirectory.join('')}`;
    const href = `/${matchedPath.join('')}`;

    if (href === directory && href !== '//') {
      selector.setAttribute(aria.current, aria.currentLocation);
    }
  });
};

const setCurrentPage = (selectors) => {
  Array.from(document.querySelectorAll(selectors)).forEach((selector) => {
    const path = hrefToRootAbsolutePath(selector);
    const locationPathname = window.location.pathname.replace(
      /index\.html$/,
      ''
    );

    if (path === locationPathname) {
      selector.setAttribute(aria.current, aria.currentPage);
    }
  });
};

/**
 * @desc ナビゲーションにカレント（`aria-current`）を付与します。
 * @param {string} selector ['nav a'] - カレントの対象になるCSSセレクター。
 * @param {number} level [1] - カレントの対象になる階層。
 * @example
 * import Current from './Current';
 * const current = new Current({
 *   selector: 'nav a',
 *   level: 1,
 * });
 * current.init();
 */

export default class Current {
  constructor(options) {
    const defaultOptions = {
      selector: 'nav a',
      level: 1,
    };

    this.options = Object.assign(defaultOptions, options);

    Object.keys(this.options).forEach((key) => {
      this[key] = this.options[key];
    });
  }

  init() {
    setCurrentLocation(this.selector, this.level);
    setCurrentPage(this.selector);
  }
}
