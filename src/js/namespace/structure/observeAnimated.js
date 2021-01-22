function observeAnimation() {
  // simple animations based on IntersectionObserver
  const targetElements = document.querySelectorAll('[data-observe-animated]');

  function handleObserve(entries) {
    // 交差検知をしたもののなかで、isIntersectingがtrueのDOMを色を変える関数に渡す
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activateAnimation(entry.target);
      }
    });
  }

  function activateAnimation(target) {
    target.setAttribute('data-observe-animated', true);
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0.75],
  };

  const observer = new IntersectionObserver(handleObserve, observerOptions);

  if (targetElements.length) {
    // アニメーションさせたい要素を監視する
    targetElements.forEach((target) => {
      observer.observe(target);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  observeAnimation();
});
