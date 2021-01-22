class splitString {
  constructor() {
    this.settings = {
      target: '.js-split-string',
    };
    this.targets = '';
    this.targetLength = 0;
    this.nodes = [];
    this.convertContents = [];
  }

  init(options) {
    this.setup(options);
    this.getNodes();
    this.convert();
    this.set();
  }

  setup(options) {
    this.settings = Object.assign(
      {
        target: this.settings.target,
      },
      options || {}
    );
    this.targets = document.querySelectorAll(this.settings.target);
    this.targetLength = this.targets.length;
  }

  getNodes() {
    for (let target of this.targets) {
      let nodes = target.childNodes;
      this.nodes.push(nodes);
    }
  }

  convert() {
    for (let i = 0; i < this.targetLength; i++) {
      this.convertContents.push([]);
      for (let node of this.nodes[i]) {
        if (node.nodeType == 3) {
          let text = node.textContent.replace(/\s+/g, '');
          text.split('').forEach((c) => {
            this.convertContents[i].push(
              `<span class="_character">${c}</span>`
            );
          });
        } else {
          this.convertContents[i].push(node.outerHTML);
        }
      }
    }
  }

  set() {
    for (let i = 0; i < this.targetLength; i++) {
      this.targets[i].innerHTML = this.convertContents[i].join('');
    }
  }
}
