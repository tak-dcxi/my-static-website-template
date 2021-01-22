/**
 * 要素にクラスを追加します。
 */
export const addClass = (el, className) => {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ` ${className}`;
  }
};

/**
 * 要素からクラスを削除します。
 */
export const removeClass = (el, className) => {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className -= ` ${className}`;
  }
};

/**
 * 要素のクラスを切り替えます。
 */
export const toggleClass = (el, className) => {
  return el.classList.toggle(className);
};

/**
 * 要素にクラスが含まれていると`true`を返し、そうでない場合は`false`を返します。。
 */
export const hasClass = (el, className) => {
  return el.classList.contains(className);
};
