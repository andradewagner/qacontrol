(function () {
  'use strict';

  angular
    .module('testes.admin')
    .controller('TestesAdminController', TestesAdminController);

  TestesAdminController.$inject = ['$scope', '$state', '$window', 'testeResolve', 'Authentication', 'Notification'];

  function TestesAdminController($scope, $state, $window, teste, Authentication, Notification) {
    var vm = this;

    vm.teste = teste;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.teste.$remove(function () {
          $state.go('admin.testes.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Teste deleted successfully!' });
        });
      }
    }


    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.testeForm');
        return false;
      }

      vm.teste.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.testes.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Teste saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Teste save error!' });
      }
    }
  }
}());
