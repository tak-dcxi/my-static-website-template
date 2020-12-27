!(function () {
  const viewport = document.querySelector('meta[name="viewport"]');
  function adjustViewport() {
    const value =
      window.outerWidth > 360
        ? 'width=device-width,initial-scale=1'
        : 'width=360';
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }
  addEventListener('resize', adjustViewport, false);
  adjustViewport();
})();
