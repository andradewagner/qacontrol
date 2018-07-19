(function () {
  'use strict';

  angular
    .module('testes.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.testes', {
        abstract: true,
        url: '/testes',
        template: '<ui-view/>'
      })
      .state('admin.testes.list', {
        url: '',
        templateUrl: '/modules/testes/client/views/admin/list-testes.client.view.html',
        controller: 'TestesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.testes.create', {
        url: '/create',
        templateUrl: '/modules/testes/client/views/admin/form-teste.client.view.html',
        controller: 'TestesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          testeResolve: newTeste
        }
      })
      .state('admin.testes.edit', {
        url: '/:testeId/edit',
        templateUrl: '/modules/testes/client/views/admin/form-teste.client.view.html',
        controller: 'TestesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ testeResolve.title }}'
        },
        resolve: {
          testeResolve: getTeste
        }
      });
  }

  getTeste.$inject = ['$stateParams', 'TestesService'];

  function getTeste($stateParams, TestesService) {
    return TestesService.get({
      testeId: $stateParams.testeId
    }).$promise;
  }

  newTeste.$inject = ['TestesService'];

  function newTeste(TestesService) {
    return new TestesService();
  }
}());
