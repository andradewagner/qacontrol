'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Teste = mongoose.model('Teste'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function (req, res) {
  var teste = new Teste(req.body);

  teste.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teste);
    }
  });
};

exports.read = function (req, res) {
  // convert mongoose document to JSON
  var teste = req.teste ? req.teste.toJSON() : {};

  // Add a custom field to the Teste, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Teste model.
  teste.isCurrentUserOwner = !!(req.user && teste.user && teste.user._id.toString() === req.user._id.toString());

  res.json(teste);
};

/**
 * Update an teste
 */
exports.update = function (req, res) {
  var teste = req.body;

  teste.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teste);
    }
  });
};

exports.update2 = function (req, res) {
  Teste.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, teste) => {
    if (err) return res.status(500).send(err);
        return res.send(teste);
  });
};

/**
 * Delete an teste
 */
exports.delete = function (req, res) {
  var teste = req.teste;

  teste.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teste);
    }
  });
};

exports.list = function (req, res, next) {
  var query = null;
  var hoje = new Date().toJSON().slice(0,10);

    if (req.query.aplicacao && req.query.data) {
      if (req.query.aplicacao === 'App Minha Oi') {
        query = {$and: [ { horaExecucao: {$gt: new Date(req.query.data).toJSON() } }, { horaExecucao: {$lt: new Date(req.query.data + ' 20:00').toJSON() } }, { aplicacao: {$in: [/App Minha Oi/] }} ]};
      } else if (req.query.aplicacao === 'Minha Oi WEB') {
        query = {$and: [ { horaExecucao: {$gt: new Date(req.query.data).toJSON() } }, { horaExecucao: {$lt: new Date(req.query.data + ' 20:00').toJSON() } }, { aplicacao: {$in: [/Minha Oi WEB/] }} ]};
      } else if (req.query.aplicacao === 'Oi Mod') {
        query = {$and: [ { horaExecucao: {$gt: new Date(req.query.data).toJSON() } }, { horaExecucao: {$lt: new Date(req.query.data + ' 20:00').toJSON() } }, { aplicacao: {$in: [/Oi Mod/] }} ]};
      } else {
        query = {$and: [ { horaExecucao: {$gt: new Date(req.query.data).toJSON() } }, { horaExecucao: {$lt: new Date(req.query.data + ' 20:00').toJSON() } }, { aplicacao: {$in: [/App Minha Oi/] }} ]};
      }

      Teste.find(query).sort('-horaExecucao, -aplicacao').exec(function (err, testes) {
        if(err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(testes);
        }
      });
    }
};

exports.listPorData = function (req, res, next, data) {
  Teste.find({'$where': 'this.horaExecucao.toJSON().slice(0, 10) == ' +  '"' + data + '"'}).sort('-horaExecucao').exec(function (err, testes) {
    if(err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(testes);
    }
  });
};

exports.testeByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Teste inválido'
    });
  }

  Teste.findById(id).exec(function (err, teste) {
    if (err) {
      return next(err);
    } else if (!teste) {
      return res.status(404).send({
        message: 'No teste with that identifier has been found'
      });
    }
    req.teste = teste;
    next();
  });
};

exports.analytics = function (req, res) {
  return res.statusCode = 200;
}
