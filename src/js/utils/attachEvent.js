export const attachEvent = (element, event, handler, options) => {
  element.addEventListener(event, handler, options);
  return {
    unsubscribe() {
      element.removeEventListener(event, handler);
    },
  };
};
