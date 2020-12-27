!(function () {
  const browser = window.navigator.userAgent.toLowerCase();
  const root = document.documentElement;

  // IEからアクセスされた場合はhtml要素に`class="ua-ie"`を付与する
  if (browser.indexOf('msie') > 0 || browser.indexOf('trident') > 0) {
    root.classList.add('ua-ie');
  }
})();
