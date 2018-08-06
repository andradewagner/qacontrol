(function () {
  'use strict';

  angular
    .module('testes')
    .controller('TestesListController', TestesListController);

  TestesListController.$inject = ['TestesService'];

  function TestesListController(TestesService, GraficoLinha) {
    var vm = this;
    vm.filtro = null;
    vm.filtroAnalytics = null;
    var opcoes = {
      responsive: true,
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              },
              scaleLabel: {
                display: true,
                labelString: 'segundos'
              }
          }],
          xAxes: [{
            barPercentage: 0.3
          }]
      }
    };

    var corThreshold = 'rgba(255, 99, 132, 0.3)';

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
        gerarGrafico();
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

    function abrirModal(imagem, id) {
      let modal = document.getElementById('myModal');
      let modalImg = document.getElementById("img01");
      let captionText = document.getElementById("caption");

      modal.style.display = "block";
      modalImg.src = '/modules/testes/client/images/'+ id + '/' + imagem;

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

    function calcularTotais() {
      var total = [];
      var sucesso = 0;
      var erro = 0;
      for(var i = 0; i < vm.testes.length; i++) {
        if(vm.testes[i].statusGeral === true) {
          sucesso = sucesso + 1;
        } else {
          erro = erro + 1;
        }
      }
      total.push(erro);
      total.push(sucesso);
      return total;
    }

    function gerarGrafico() {
      var labels = extrairLabels();
      console.log(labels);
      var totais = calcularTotais();
      var ctxTotais = $("#myChartTotais");
      var tensaoLinha = 0.2;

      var myChartTotais = new Chart(ctxTotais, {
          type: 'bar',
          data: {
              labels: ["Erro", "Sucesso"],
              datasets: [{
                  label: 'Resumo das Execuções',
                  data: [totais[0], totais[1]],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.3)',
                      'rgba(75, 192, 192, 0.3)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(75, 192, 192, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: opcoes
      });

      var graph1 = extrairTotaisGraficos('Login');
      if(graph1[0].length === 0) graph1 = extrairTotaisGraficos('Access Token');

      var ctxGraph1 = $("#graph1");
      var myChartGraph1 = new Chart(ctxGraph1, {
          type: 'line',
          data: {
            labels: graph1[1],
              datasets: [{
                label: labels[0],
                  data: graph1[0],
                  fill: false,
                  lineTension: tensaoLinha,
                  borderColor:
                      'rgba(75, 192, 192, 1)'
                  ,
                  borderWidth: 3
              },{
                label: 'Threshold',
                data: threshold(graph1[0].length),
                fill: false,
                borderColor: corThreshold
              }]
          },
          options: opcoes
      });

      var graph2 = extrairTotaisGraficos('Compra');
      if(graph2[0].length === 0) graph2 = extrairTotaisGraficos('Trocar Voz/Internet');

      var ctxGraph2 = $("#graph2");
      var myChartGraph2 = new Chart(ctxGraph2, {
          type: 'line',
          data: {
            labels: graph2[1],
              datasets: [{
                label: labels[1],
                  data: graph2[0],
                  fill: false,
                  lineTension: tensaoLinha,
                  borderColor:
                      'rgba(75, 192, 192, 1)'
                  ,
                  borderWidth: 3
              },{
                label: 'Threshold',
                data: threshold(graph2[0].length),
                fill: false,
                borderColor: corThreshold
              }]
          },
          options: opcoes
      });

      var graph3 = extrairTotaisGraficos('Internet');
      if(graph3[0].length === 0) graph3 = extrairTotaisGraficos('Comprar pacotes sms');

      var ctxGraph3 = $("#graph3");
      var myChartGraph3 = new Chart(ctxGraph3, {
          type: 'line',
          data: {
            labels: graph3[1],
              datasets: [{
                label: labels[2],
                  data: graph3[0],
                  fill: false,
                  lineTension: tensaoLinha,
                  borderColor:
                      'rgba(75, 192, 192, 1)'
                  ,
                  borderWidth: 3
              },{
                label: 'Threshold',
                data: threshold(graph3[0].length),
                fill: false,
                borderColor: corThreshold
              }]
          },
          options: opcoes
      });

      var graph4 = extrairTotaisGraficos('Troca');
      if(graph4[0].length === 0) graph4 = extrairTotaisGraficos('Comprar pacotes voz');

      var ctxGraph4 = $("#graph4");
      var myChartGraph4 = new Chart(ctxGraph4, {
          type: 'line',
          data: {
            labels: graph4[1],
              datasets: [{
                label: labels[3],
                  data: graph4[0],
                  fill: false,
                  lineTension: tensaoLinha,
                  borderColor:
                      'rgba(75, 192, 192, 1)'
                  ,
                  borderWidth: 3
              },{
                label: 'Threshold',
                data: threshold(graph4[0].length),
                fill: false,
                borderColor: corThreshold
              }]
          },
          options: opcoes
      });

      var graph5 = extrairTotaisGraficos('Voz');
      if(graph5[0].length === 0) graph5 = extrairTotaisGraficos('Comprar pacotes internet');

      var ctxGraph5 = $("#graph5");
      var myChartGraph5 = new Chart(ctxGraph5, {
          type: 'line',
          data: {
            labels: graph5[1],
              datasets: [{
                label: labels[4],
                  data: graph5[0],
                  fill: false,
                  lineTension: tensaoLinha,
                  borderColor:
                      'rgba(75, 192, 192, 1)'
                  ,
                  borderWidth: 3
              },{
                label: 'Threshold',
                data: threshold(graph5[0].length),
                fill: false,
                borderColor: corThreshold
              }]
          },
          options: opcoes
      });

      var graph6 = extrairTotaisGraficos('Comprar pacotes mix');
      var ctxGraph6 = $("#graph6");
      var myChartGraph6 = new Chart(ctxGraph6, {
          type: 'line',
          data: {
            labels: graph6[1],
              datasets: [{
                label: labels[5],
                  data: graph6[0],
                  fill: false,
                  lineTension: tensaoLinha,
                  borderColor:
                      'rgba(75, 192, 192, 1)'
                  ,
                  borderWidth: 3
              },{
                label: 'Threshold',
                data: threshold(graph6[0].length),
                fill: false,
                borderColor: corThreshold
              }]
          },
          options: opcoes
      });

      var graph7 = extrairTotaisGraficos('Home :: Recarga');
      var ctxGraph7 = $("#graph7");
      var myChartGraph7 = new Chart(ctxGraph7, {
          type: 'line',
          data: {
            labels: graph7[1],
              datasets: [{
                label: labels[6],
                  data: graph7[0],
                  fill: false,
                  lineTension: tensaoLinha,
                  borderColor:
                      'rgba(75, 192, 192, 1)'
                  ,
                  borderWidth: 3
              },{
                label: 'Threshold',
                data: threshold(graph7[0].length),
                fill: false,
                borderColor: corThreshold
              }]
          },
          options: opcoes
      });

      var graph8 = extrairTotaisGraficos('Menu Navegação :: Mudar sua oferta');
      var ctxGraph8 = $("#graph8");
      var myChartGraph8 = new Chart(ctxGraph8, {
          type: 'line',
          data: {
            labels: graph8[1],
              datasets: [{
                label: labels[7],
                  data: graph8[0],
                  fill: false,
                  lineTension: tensaoLinha,
                  borderColor:
                      'rgba(75, 192, 192, 1)'
                  ,
                  borderWidth: 3
              },{
                label: 'Threshold',
                data: threshold(graph8[0].length),
                fill: false,
                borderColor: corThreshold
              }]
          },
          options: opcoes
      });

      var graph9 = extrairTotaisGraficos('Menu Navegação :: Entenda a sua oferta');
      var ctxGraph9 = $("#graph9");
      var myChartGraph9 = new Chart(ctxGraph9, {
          type: 'line',
          data: {
            labels: graph9[1],
              datasets: [{
                label: labels[8],
                  data: graph9[0],
                  fill: false,
                  lineTension: tensaoLinha,
                  borderColor:
                      'rgba(75, 192, 192, 1)'
                  ,
                  borderWidth: 3
              },{
                label: 'Threshold',
                data: threshold(graph9[0].length),
                fill: false,
                borderColor: corThreshold
              }]
          },
          options: opcoes
      });

      function threshold(tamanho){
        var x = [];
        for(var i = 0; i < tamanho; i++){
          x.push(2);
        }
        return x;
      }

    }


    function extrairTotaisGraficos(grafico) {
      var totais = [];
      var execucoes = [];

      for(var i = 0; i < vm.separados.length; i++) {
        for(var j = 0; j < vm.separados[i].length; j++) {
          for(var k = 0; k < vm.separados[i][j].cenarios.length; k++){
            if(vm.separados[i][j].cenarios[k].cenario === grafico) {
              totais.push(vm.separados[i][j].cenarios[k].duracao / 1000);
              execucoes.push('Execução ' + (j+1));
            }
          }
        }
      }
      return [totais, execucoes];
    }

    function extrairLabels() {
      var labels = [];

      for(var k = 0; k < vm.separados[0][0].cenarios.length; k++){
        labels.push(vm.separados[0][0].cenarios[k].cenario);
      }

      return labels;
    }

  }
}());
