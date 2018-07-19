(function (app) {
  'use strict';

  app.registerModule('testes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('testes.admin', ['core.admin']);
  app.registerModule('testes.admin.routes', ['core.admin.routes']);
  app.registerModule('testes.services');
  app.registerModule('testes.routes', ['ui.router', 'core.routes', 'testes.services']);
}(ApplicationConfiguration));
