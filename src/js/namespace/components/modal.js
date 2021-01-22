export default class Modal {
  constructor(modal, options) {
    this.modal = modal;
    if (!this.modal) return;

    const defaultOptions = {
      openTriggerSelector: '[data-modal-target]', // モーダルを開く際のターゲットとなるセレクタ
      closeTriggerSelector: '.js-modal-close', // モーダルを閉じる際のターゲットとなるセレクタ
      siteContentsSelector: '#site-area', // メインコンテンツのラッパー。開いている時はここを読み上げ対象外にする。
      disableBackfaceScroll: true, // 開いている時に背面のスクロールを無効化するか
      disableBackfaceFocus: true, // フォーカスをモーダル内でループさせるか
      toggleDuration: 500, // モーダルのDuration
    };

    const mergedOptions = Object.assign(defaultOptions, options);
    this.options = mergedOptions;

    // モーダルを開くトリガー
    this.openTrigger = Array.from(
      document.querySelectorAll(this.options.openTriggerSelector)
    );
    if (!this.openTrigger.length)
      throw TypeError('"openTriggerSelector"は必須です');

    // モーダルを閉じるトリガー
    this.closeTrigger = Array.from(
      document.querySelectorAll(this.options.closeTriggerSelector)
    );
    if (!this.closeTrigger.length)
      throw TypeError('"closeTriggerSelector"は必須です');

    // メインコンテンツのラッパー
    this.siteContentsSelector = document.querySelector(
      this.options.siteContentsSelector
    );
    if (!this.siteContentsSelector)
      throw TypeError('"siteContentsSelector"は必須です');

    const subscriptions = [
      ...this.openTrigger.map((element) => {
        attachEvent(element, 'click', this.handleOpenerClick.bind(this));
      }),
      ...this.closeTrigger.map((trigger) => {
        attachEvent(trigger, 'click', this.handleCloserClick.bind(this));
      }),
      attachEvent(document, 'keyup', this.handleKeyup.bind(this)),
      attachEvent(document, 'keydown', this.handleKeydown.bind(this)),
    ];

    this.subscriptions = subscriptions;
    this.isExpanded = false; // モーダルの開閉状態を格納する
    this.currentTarget;
    this.prepareAttributes();
  }

  destroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  prepareAttributes() {
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', true);
    this.modal.setAttribute('aria-hidden', true);
    this.modal.setAttribute('tabindex', '-1');
    this.modal.style.display = 'none';

    this.openTrigger.map((trigger) => {
      trigger.setAttribute('aria-haspopup', 'dialog');
    });

    document.documentElement.style.setProperty(
      '--modal-toggle-duration',
      `${this.options.toggleDuration}ms`
    );
  }

  handleOpenerClick(event) {
    event.preventDefault;
    this.open(event);
  }

  handleCloserClick(event) {
    event.preventDefault;
    this.close();
  }

  handleKeyup(event) {
    const pressEsc = event.keyCode === 27;

    if (this.isExpanded && pressEsc) this.close();
  }

  handleKeydown(event) {
    if (!this.isExpanded || !this.options.disableBackfaceFocus) return;

    const nodes = this.getFocusableNodes(this.root);
    const pressTab = !event.shiftKey && event.keyCode === 9;
    const pressShiftTab = event.shiftKey && event.keyCode === 9;

    if (pressTab && document.activeElement === nodes.last) {
      event.preventDefault();
      nodes.first.focus();
    }

    if (pressShiftTab && document.activeElement === nodes.first) {
      event.preventDefault();
      nodes.last.focus();
    }

    return;
  }

  open(event) {
    const targetTrigger = event.currentTarget;
    const targetId = targetTrigger.getAttribute('data-modal-target');
    const targetModal = document.getElementById(targetId);

    targetModal.setAttribute('aria-hidden', false);
    targetModal.style.display = '';

    if (this.siteContentsSelector)
      this.siteContentsSelector.setAttribute('inert', '');

    if (this.options.disableBackfaceScroll) this.backfaceFixed(true);

    this.currentTarget = document.activeElement;

    setTimeout(() => {
      targetModal.focus();
    }, 100);

    this.isExpanded = true;
  }

  close(event) {
    this.modal.setAttribute('aria-hidden', true);
    this.modal.setAttribute('inert', '');

    if (this.siteContentsSelector)
      this.siteContentsSelector.removeAttribute('inert');

    if (this.options.disableBackfaceScroll) this.backfaceFixed();

    new Promise((resolve) => {
      setTimeout(() => {
        this.modal.style.display = 'none';
        this.modal.removeAttribute('inert');
        resolve();
      }, this.options.toggleDuration);
    }).then(() => {
      this.currentTarget.focus();
    });

    this.isExpanded = false;
  }

  backfaceFixed(fixed) {
    const scrollbarWidth = window.innerWidth - document.body.clientWidth;
    document.body.style.paddingRight = fixed ? `${scrollbarWidth}px` : '';

    const scrollingElement = () => {
      const browser = window.navigator.userAgent.toLowerCase();

      if ('scrollingElement' in document) return document.scrollingElement;

      if (browser.indexOf('webkit') > 0) return document.body;

      return document.documentElement;
    };

    if (fixed)
      scrollingElement().setAttribute('data-scroll-amount', window.pageYOffset);
    const scrollAmount = scrollingElement().getAttribute('data-scroll-amount');

    const styles = {
      height: '100vh',
      left: '0',
      overflow: 'hidden',
      position: 'fixed',
      top: `${scrollAmount * -1}px`,
      width: '100vw',
    };

    Object.keys(styles).forEach((key) => {
      scrollingElement().style[key] = fixed ? styles[key] : '';
    });

    if (!fixed) {
      window.scrollTo(0, scrollAmount);
      scrollingElement().removeAttribute('data-scroll-amount');
    }
  }

  getFocusableNodes() {
    const nodes = this.modal.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), details, summary, iframe, object, embed, [contenteditable], [tabindex]:not([tabindex="-1"])'
    );
    return {
      first: nodes[0],
      last: nodes[nodes.length - 1],
      all: nodes,
    };
  }
}
