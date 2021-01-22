!(function () {
  const anchor = document.querySelectorAll('[href^="#"]:not([role="tab"])');

  anchor.forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();

      const hash = event.currentTarget.hash;
      const targetElement = hash ? document.querySelector(hash) : document.body;

      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
})();
