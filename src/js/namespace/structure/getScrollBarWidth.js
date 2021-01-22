let scrollbarWidth;

function measureScrollBarWidth(opts = {}) {
  const { force = false } = opts;

  if (force || typeof scrollbarWidth === 'undefined') {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.overflowY = 'scroll';
    div.style.width = div.style.height = '100px';
    document.body.appendChild(div);
    scrollbarWidth = div.offsetWidth - div.scrollWidth;
    document.body.removeChild(div);
  }

  return scrollbarWidth;
}

export default function setScrollbarCssVar() {
  const scrollBarWidth = measureScrollBarWidth();
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${scrollBarWidth}px`
  );
}
