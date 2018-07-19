(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('testes.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Gerenciar Testes',
      state: 'admin.testes.list'
    });
  }
}());
