'use strict';

/**
 * Module dependencies
 */
var testesPolicy = require('../policies/testes.server.policy'),
  testes = require('../controllers/testes.server.controller');

module.exports = function (app) {
  //Coleções
  app.route('/api/testes')//.all(testesPolicy.isAllowed)
    .get(testes.list)
    .post(testes.create);

  app.route('/api/testesPorData/:data')
    .get(testes.listPorData);

  // Rotas únicas
  app.route('/api/testes/:testeId')//.all(testesPolicy.isAllowed)
    .get(testes.read)
    .put(testes.update)
    .delete(testes.delete);

  app.route('/api/testes/analytics')
    .get(testes.analytics);

  app.route('/api/teste/:testeId')
    .put(testes.update2);

  // Finish by binding the article middleware
  app.param('testeId', testes.testeByID);
  app.param('data', testes.listPorData);
};
