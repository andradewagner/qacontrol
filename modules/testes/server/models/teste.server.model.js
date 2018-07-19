'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

var TesteSchema = new Schema({
  aplicacao: {
    type: String,
    default: '',
    trim: true,
    required: 'Nome da aplicação não pode ser em branco'
  },
  versao: {
    type: String,
    default: '',
    trim: true
  },
  horaExecucao: {
    type: Date,
    default: Date.now
  },
  massaTeste: {
    type: String,
    default: '',
    trim:true
  },
  recurso:{
    type: String,
    default: '',
    trim: true
  },
  cenarios: [{
    cenario: {
      type: String,
      default: '',
      trim: true,
      required: 'Nome do cenário não pode ser em branco'
    },
    imagem: {
      type: String
    },
    status: {
      type: Boolean
    },
    duracao: {
      type: String,
      default: '',
      trim: true
    },
    erro: {
      type: String,
      default: '',
      trim: true
    }
  }],
  statusGeral: {
    type: Boolean,
    default: false
  },
  tempoTotal: {
    type: Number,
    default: 0
  }
});

//TesteSchema.statics.seed = seed;

mongoose.model('Teste', TesteSchema);

/**
* Seeds the User collection with document (Article)
* and provided options.
*/
function seed(doc, options) {
  var Teste = mongoose.model('Teste');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Teste
          .findOne({
            title: doc.title
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Article (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Article\t' + doc.title + ' skipped')
          });
        }

        var teste = new Teste(doc);

        teste.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Article\t' + teste.title + ' added'
          });
        });
      });
    }
  });
}
