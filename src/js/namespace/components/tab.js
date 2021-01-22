export default class Tab {
  constructor(root, options) {
    const defaultOptions = {
      tablist: '[role="tablist"]',
      tabs: '[role="tab"]',
      tabpanels: '[role="tabpanel"]',
      firstView: 1, // 何枚目のパネルを初期表示にするか
    };

    const mergedOptions = Object.assign(defaultOptions, options);
    this.option = mergedOptions;

    // タブコンポーネントの親要素
    this.root = root;
    if (!this.root) return;

    // タブコンポーネントの`role="tablist"`に位置する要素
    this.tablist = this.root.querySelector(this.option.tablist);
    if (!this.tablist) return;

    // タブコンポーネントの`role="tab"`に位置する要素
    this.tabs = Array.from(this.root.querySelectorAll(this.option.tabs));
    if (!this.tabs) return;

    // タブコンポーネントの`role="tabpanel"`に位置する要素
    this.tabpanels = Array.from(
      this.root.querySelectorAll(this.option.tabpanels)
    );
    if (!this.tabpanels) return;

    this.prepareAttributes();
    this.handleClickEvent();
    this.handleKeyupEvent();
    this.showFirstView();
  }

  handleClickEvent() {
    this.tabs.map((tab) => {
      tab.addEventListener('click', this.show.bind(this), false);
    });
  }

  handleKeyupEvent() {
    this.tabs.map((tab) => {
      tab.addEventListener('keyup', this.move.bind(this), false);
    });
  }

  prepareAttributes() {
    const prefix = 'tab-' + Math.random().toString(32).substring(2);

    this.tabs.map((tab, index) => {
      tab.setAttribute('id', `${prefix}-button-${index}`);
      tab.setAttribute('href', `#${prefix}-panel-${index}`);
      tab.setAttribute('aria-controls', `${prefix}-panel-${index}`);
      tab.setAttribute('aria-selected', false);
      tab.setAttribute('tabindex', '-1');
    });

    this.tabpanels.map((tabpanel, index) => {
      tabpanel.setAttribute('id', `${prefix}-panel-${index}`);
      tabpanel.setAttribute('aria-labelledby', `${prefix}-button-${index}`);
      tabpanel.setAttribute('aria-hidden', true);
      tabpanel.style.display = 'none';
    });
  }

  showFirstView() {
    const viewIndex = Number(this.option.firstView) - 1;

    this.tabs[viewIndex].setAttribute('tabindex', '0');
    this.tabs[viewIndex].setAttribute('aria-selected', true);
    this.tabpanels[viewIndex].setAttribute('aria-hidden', false);
    this.tabpanels[viewIndex].style.display = 'block';
  }

  show(event) {
    const targetTab = event.currentTarget;

    this.tabs.map((tab) => {
      tab.setAttribute('aria-selected', false);
      tab.setAttribute('tabindex', '-1');
    });

    this.tabpanels.map((tabpanel) => {
      tabpanel.setAttribute('aria-hidden', true);
      tabpanel.style.display = 'none';
    });

    const targetId = targetTab.getAttribute('aria-controls');
    const targetTabpanel = document.getElementById(targetId);

    targetTab.setAttribute('tabindex', '0');
    targetTab.setAttribute('aria-selected', true);
    targetTabpanel.setAttribute('aria-hidden', false);
    targetTabpanel.style.display = 'block';

    event.preventDefault();
    return;
  }

  move(event) {
    const pressArrowLeft = event.keyCode === 37;
    const pressArrowRight = event.keyCode === 39;
    const pressEnter = event.keyCode === 13;
    const pressSpace = event.keyCode === 32;

    let index = this.tabs.indexOf(event.currentTarget);
    if (pressArrowLeft) index -= 1;
    if (pressArrowRight) index += 1;
    if (index === -1) index = this.tabs.length - 1;
    if (index === this.tabs.length) index = 0;

    const target = this.tabs[index];

    if (pressArrowLeft || pressArrowRight) {
      target.focus();
    }

    if (pressEnter || pressSpace) {
      target.focus();
      target.click();
      event.preventDefault();
    }

    return;
  }
}
