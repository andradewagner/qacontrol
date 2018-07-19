(function () {
  'use strict';

  angular
    .module('testes')
    .controller('TestesListController', TestesListController);

  TestesListController.$inject = ['TestesService'];

  function TestesListController(TestesService) {
    var vm = this;
    vm.filtro = null;
    vm.filtroAnalytics = null;

    vm.limparFiltro = function() {
      vm.testes = null;
      vm.separados = null;
      vm.filtro = null;
      vm.filtroAnalytics = null;
      $('#calendario').val('');
    };

    vm.filtrarApp = function(valor) {
      vm.filtroAnalytics = valor;
      if(vm.filtro && vm.filtroAnalytics) {
        vm.testes = TestesService.query({aplicacao: valor, data: vm.filtro});
        dissecarTestes();
      }
    }

    function dissecarTestes() {
      vm.testes.$promise.then(function() {
        vm.separados = separaTestes(vm.testes);
      });
    }

    function separaTestes(testes) {
      var separados = [[],[]];

      for (var i = 0; i < testes.length; i++) {
        for (var j = 0; j < testes.length; j++) {
          if(testes[i].recurso === testes[j].recurso) {
            separados[0,0].push(testes[i]);
            break;
          } else {
            separados[0,1].push(testes[i]);
            break;
          }
        }
      }
      return separados;
    }

    vm.abrirModal = abrirModal;

    function abrirModal(indice, id) {
      let modal = document.getElementById('myModal');
      let modalImg = document.getElementById("img01");
      let captionText = document.getElementById("caption");

      modal.style.display = "block";
      modalImg.src = '/modules/testes/client/images/'+ id + '/' + '0' + (indice + 1) + '.png';

      var span = document.getElementsByClassName("close")[0];
      span.onclick = function() {
          modal.style.display = "none";
      }
    }

    $('#calendario').datepicker({
      dateFormat: 'dd-mm-yy',
      monthNames: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" ],
      dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
      dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      onSelect: function() {
        var data = $(this).datepicker('getDate');
        vm.filtro = data.toISOString().slice(0, 10);
        vm.filtrarApp(vm.filtroAnalytics);
      }
    });
  }
}());
