(function () {
  'use strict';

  angular
    .module('testes.services')
    .factory('TestesService', TestesService);

  TestesService.$inject = ['$resource', '$log'];

  function TestesService($resource, $log) {
    var Teste = $resource('/api/testes/:testeId', {
      testeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Teste.prototype, {
      createOrUpdate: function () {
        var teste = this;
        return createOrUpdate(teste);
      }
    });

    return Teste;

    function createOrUpdate(teste) {
      if (teste._id) {
        return teste.$update(onSuccess, onError);
      } else {
        return teste.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(teste) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
