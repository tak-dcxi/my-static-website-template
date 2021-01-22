/**
 * 直近の親要素を取得します。
 */
export const closest = (el, selector) => {
  let current;
  for (current = el; current; current = current.parentElement) {
    if (current.matches(selector)) {
      break;
    }
  }
  return current;
};
