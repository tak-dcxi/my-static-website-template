/**
 * 指定されたすべての要素を表示します。
 */
export const show = (...el) => {
  return [...el].forEach((e) => {
    return (e.style.display = '');
  });
};

/**
 * 指定されたすべての要素を非表示にします。
 */
export const hide = (els) => {
  return els.forEach((e) => {
    return (e.style.display = 'none');
  });
};
