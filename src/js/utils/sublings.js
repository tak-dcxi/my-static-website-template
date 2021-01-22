/**
 * 兄弟要素を取得します。
 */
export const siblings = (el) => {
  return Array.prototype.filter.call(
    el.parentNode.children,
    function (sibling) {
      return sibling !== el;
    }
  );
};
