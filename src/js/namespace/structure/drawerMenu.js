import MicroModal from 'micromodal';

MicroModal.init({
  disableScroll: true,
  disableFocus: true,
});

function DrawerMenu(content, button, controller) {
  this.content = content;
  this.button = button;
  this.controller = controller;

  this.bindTogglerClickHandler();
}

DrawerMenu.prototype.bindTogglerClickHandler = function () {
  if (this.controller.length === 0) {
    return;
  }

  this.controller.forEach((el) => {
    el.addEventListener('click', this.toggle.bind(this));
  });
};

DrawerMenu.prototype.toggle = function (event) {
  const isExpanded = this.content.getAttribute('aria-hidden') !== 'true';

  event.preventDefault();

  if (isExpanded) {
    MicroModal.close(this.content.getAttribute('id'));
  } else {
    MicroModal.show(this.content.getAttribute('id'));
  }

  this.button.setAttribute('aria-expanded', !isExpanded);
};
