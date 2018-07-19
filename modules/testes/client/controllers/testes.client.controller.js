(function () {
  'use strict';

  angular
    .module('testes')
    .controller('TestesController', TestesController);

  TestesController.$inject = ['$scope', 'testeResolve', 'Authentication'];

  function TestesController($scope, teste, Authentication) {
    var vm = this;

    vm.teste = teste;
    vm.authentication = Authentication;

    vm.abrirModal = abrirModal;

    function abrirModal(indice) {
      let modal = document.getElementById('myModal');
      let modalImg = document.getElementById("img01");
      let captionText = document.getElementById("caption");

      modal.style.display = "block";
      modalImg.src = '/modules/testes/client/images/'+ teste._id + '/' + '0' + (indice + 1) + '.png';
      
      var span = document.getElementsByClassName("close")[0];
      span.onclick = function() {
          modal.style.display = "none";
      }
    }

  }
}());
