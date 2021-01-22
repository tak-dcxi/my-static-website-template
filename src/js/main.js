import '../scss/style.scss';

import './polyfill';

import './namespace/structure/adjustVh';
import './namespace/structure/adjustViewport';
import setScrollbarCssVar from './namespace/structure/getScrollBarWidth';
import './utils/ie';

import './namespace/structure/drawerMenu';

setScrollbarCssVar();

console.log('main.js is loaded');
