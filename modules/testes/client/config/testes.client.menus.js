(function () {
  'use strict';

  angular
    .module('testes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Testes',
      state: 'testes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'testes', {
      title: 'Listar Testes',
      state: 'testes.list',
      roles: ['*']
    });
  }
}());
