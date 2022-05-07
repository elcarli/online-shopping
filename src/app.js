const express = require('express');
const users = require('./user/index');
const products = require('./product/index');
const orders = require('./order/index');
const routes = require('./route/index');
const errorHandler = require('./error-handler/error-handler');

function createApp() {

  const app = express();
  app.use(express.json());

  app.use('/', routes);
  app.use('/api/users', users);
  app.use('/api/products', products);
  app.use('/api/orders', orders);
  app.use(errorHandler())

  return app;
}

module.exports = createApp;