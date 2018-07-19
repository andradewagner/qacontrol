(function () {
  'use strict';

  angular
    .module('testes.admin')
    .controller('TestesAdminListController', TestesAdminListController);

  TestesAdminListController.$inject = ['TestesService'];

  function TestesAdminListController(TestesService) {
    var vm = this;

    vm.testes = TestesService.query();
  }
}());
