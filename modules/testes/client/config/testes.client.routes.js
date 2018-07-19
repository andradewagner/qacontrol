(function () {
  'use strict';

  angular
    .module('testes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('testes', {
        abstract: true,
        url: '/testes',
        template: '<ui-view/>'
      })
      .state('testes.analytics', {
        url: '/analytics',
        templateUrl: '/modules/testes/client/views/view-teste-analytics.client.view.html'
      })
      .state('testes.list', {
        url: '',
        templateUrl: '/modules/testes/client/views/list-testes.client.view.html',
        controller: 'TestesListController',
        controllerAs: 'vm'
      })
      .state('testes.view', {
        url: '/:testeId',
        templateUrl: '/modules/testes/client/views/view-teste.client.view.html',
        controller: 'TestesController',
        controllerAs: 'vm',
        resolve: {
          testeResolve: getTeste
        },
        data: {
          pageTitle: '{{ testeResolve.title }}'
        }
      });
  }

  getTeste.$inject = ['$stateParams', 'TestesService'];

  function getTeste($stateParams, TestesService) {
    return TestesService.get({
      testeId: $stateParams.testeId
    }).$promise;
  }
}());
