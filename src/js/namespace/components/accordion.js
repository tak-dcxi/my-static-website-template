/**
 * @overview アクセシビリティを配慮したアコーディオンです。
 * @see https://codepen.io/tak-dcxi/pen/yLaaJYj
 * @param {CSS selectors} element ['.js-accordion'] - ルートに指定するclass名です。
 * @param {CSS selectors} tabs ['.js-accordion-tab'] - タブに指定するclass名です。
 * @param {CSS selectors} tabpanels ['.js-accordion-panel'] - パネルに指定するクラス名です。
 * @param {String} timingFunction - パネル開閉時のイージングを指定します。
 * @param {String} duration - パネル開閉時のアニメーション時間を指定します。
 * @param {boolean} multiSelectable - 複数の要素を同時に開くのを許可します。
 *
 * @example
 * <div class="c-accordion js-accordion">
 *  <section class="c-accordion__item">
 *    <h2 class="c-accordion__headline">
 *      <button type="button" class="c-accordion__tab js-accordion-tab">
 *        見出し
 *        <span class="c-accordion__tabicon"></span>
 *      </button>
 *    </h2>
 *    <div class="c-accordion__panel js-accordion-panel">
 *      <div class="c-accordion__panel-content">
 *        <p>テキスト</p>
 *      </div>
 *    </div>
 *  </section>
 *
 *  ...
 *
 * </div>
 **/

const defaultOptions = {
  // アコーディオンのパネルの開閉時のtransitionを指定
  timingFunction: 'ease-out',
  duration: '.3s',
  // 複数開けるようにするか
  openMultiple: false,
};

export default class Accordion {
  constructor(element, options) {
    const mergedOptions = Object.assign({}, defaultOptions, options);

    // 必須オプションをチェックする
    if (!options.tabs) {
      throw TypeError('"tabs"オプションは必須です');
    }
    if (!options.panels) {
      throw TypeError('"panels"オプションは必須です');
    }

    // タブとパネルを取ってくる
    const tabs = Array.from(element.querySelectorAll(options.tabs));
    const panels = Array.from(element.querySelectorAll(options.panels));

    // イベントハンドラを設定する
    const subscriptions = [
      ...tabs.map((tab) => attachEvent(tab, 'click', this.handleTabClick.bind(this))),
      attachEvent(window, 'resize', this.handleResize.bind(this)),
    ]

    this.element = element;
    this.tabs = tabs;
    this.panels = panels;
    this.options = mergedOptions;
    this.subscriptions = subscriptions;
    this.expanded = new Set();

    this.prepareAttributes();
  }

  destroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  handleTabClick(event) {
    const tab = event.currentTarget;
    const tabIndex = this.tabs.indexOf(tab);
    this.toggleItem(tabIndex, !this.expanded.has(tabIndex));
    event.preventDefault();
  }

  handleResize() {
    this.adjustHeight();
  }

  prepareAttributes() {
    const randomId = 'accordion-' + Math.random().toString(36).slice(2);

    // アコーディオンコンポーネントのタブに付与する属性
    this.tabs.forEach((tab, index) => {
      tab.setAttribute('id', `${randomId}-tab-${index}`);
      tab.setAttribute('aria-expanded', 'false');
      tab.setAttribute('aria-controls', `${randomId}-panel-${index}`);
    });

    // アコーディオンコンポーネントのパネルに付与する属性
    this.panels.forEach((panel, index) => {
      panel.setAttribute('id', `${randomId}-panel-${index}`);
      panel.setAttribute('aria-hidden', 'true');
      panel.style.boxSizing = 'border-box';
      panel.style.overflow = 'hidden';
      panel.style.maxHeight = '0px';
    });
  }

  toggleItem(itemIndex, expand, {noTransition = false} = {}) {
    const isItemExpanded = this.expanded.has(itemIndex);

    if (expand === isItemExpanded) {
      return;
    }

    const updateItemAttribute = (itemIndex, expand) => {
      const targetTab = this.tabs[itemIndex];
      const targetPanel = this.panels[itemIndex];
      targetTab.setAttribute('aria-expanded', String(expand));
      targetPanel.setAttribute('aria-hidden', String(!expand));
      targetPanel.style.maxHeight = expand ? targetPanel.children[0].clientHeight + 'px' : '0px';
      targetPanel.style.visibility = expand ? 'visible' : 'hidden';
      targetPanel.style.transition = noTransition ?
        '' :
        `max-height ${this.options.timingFunction} ${this.options.duration}, visibility ${this.options.duration}`;
      this.expanded[expand ? 'add' : 'delete'](itemIndex);
    }

    // 複数選択可能の設定がされていない時は開いているパネルをすべて閉じる
    if (!this.options.openMultiple && !isItemExpanded) {
      this.expanded.forEach((index) => updateItemAttribute(index, false));
    }

    updateItemAttribute(itemIndex, expand);
  }

  adjustHeight() {
    // 開いているパネルの高さを再計算する
    this.expanded.forEach((index) => {
      const panel = this.panels[index];
      const resizedHeight = panel.children[0].clientHeight;
      panel.style.maxHeight = resizedHeight + 'px';
    });
  }
}

function attachEvent(element, event, handler, options) {
  element.addEventListener(event, handler, options);
  return {
    unsubscribe() {
      element.removeEventListener(event, handler);
    }
  }
}
