document.addEventListener('DOMContentLoaded', () => {
  new DrawerMenu();
});

function DrawerMenu() {
  this.menuContent = document.getElementById('menu-content');
  this.burgerButton = document.getElementById('menu-button');
  this.controller = document.querySelectorAll('.js-drawer-toggle');

  this.handleClick();
  this.init();
}

DrawerMenu.prototype.handleClick = function () {
  if (this.controller.length === 0) {
    return;
  }

  this.controller.forEach((element) => {
    element.addEventListener('click', this.toggle.bind(this));
  });
};

DrawerMenu.prototype.toggle = function (event) {
  const target = this.menuContent.getAttribute('id');
  const isExpanded = this.menuContent.getAttribute('aria-hidden') !== 'true';

  this.burgerButton.setAttribute('aria-expanded', !isExpanded);

  if (isExpanded) {
    MicroModal.close(target);
  } else {
    MicroModal.show(target);
  }

  event.preventDefault();

  return;
};

DrawerMenu.prototype.init = () => {
  MicroModal.init({
    disableScroll: true,
    disableFocus: true,
  });
};
