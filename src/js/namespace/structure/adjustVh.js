!(function () {
  let vw = window.innerWidth;

  const adjustVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  window.addEventListener('resize', () => {
    if (vw === window.innerWidth) {
      // 画面の横幅にサイズ変動がないので処理を終える
      return;
    }
    // 画面の横幅のサイズ変動があった時のみ高さを再計算する
    vw = window.innerWidth;
    adjustVh();
  });

  // 初期化
  adjustVh();
})();
