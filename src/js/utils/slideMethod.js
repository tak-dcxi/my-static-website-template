const slideUp = (target, duration = 300) => {
  const el = target;
  el.style.transitionProperty = 'height, margin, padding';
  el.style.transitionDuration = duration + 'ms';
  el.style.height = el.offsetHeight + 'px';
  el.offsetHeight; // eslint-disable-line no-unused-expressions
  el.style.overflow = 'hidden';
  el.style.height = 0;
  el.style.paddingTop = 0;
  el.style.paddingBottom = 0;
  el.style.marginTop = 0;
  el.style.marginBottom = 0;

  window.setTimeout(() => {
    el.style.display = 'none';
    el.style.removeProperty('height');
    el.style.removeProperty('padding-top');
    el.style.removeProperty('padding-bottom');
    el.style.removeProperty('margin-top');
    el.style.removeProperty('margin-bottom');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition-duration');
    el.style.removeProperty('transition-property');
  }, duration);
};

const slideDown = (target, duration = 300) => {
  const el = target;
  el.style.removeProperty('display');
  const computedDisplay = window.getComputedStyle(el).display;
  const display = computedDisplay === 'none' ? 'block' : computedDisplay;
  el.style.display = display;

  const height = el.offsetHeight;

  el.style.overflow = 'hidden';
  el.style.height = 0;
  el.style.paddingTop = 0;
  el.style.paddingBottom = 0;
  el.style.marginTop = 0;
  el.style.marginBottom = 0;
  el.offsetHeight; // eslint-disable-line no-unused-expressions
  el.style.boxSizing = 'border-box';
  el.style.transitionProperty = 'height, margin, padding';
  el.style.transitionDuration = duration + 'ms';
  el.style.height = height + 'px';
  el.style.removeProperty('padding-top');
  el.style.removeProperty('padding-bottom');
  el.style.removeProperty('margin-top');
  el.style.removeProperty('margin-bottom');

  window.setTimeout(() => {
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition-duration');
    el.style.removeProperty('transition-property');
  }, duration);
};

const slideToggle = (target, duration = 300) => {
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  }

  return slideUp(target, duration);
};

export { slideUp, slideDown, slideToggle };
