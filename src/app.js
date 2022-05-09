const express = require('express');
const users = require('./user/index');
const products = require('./product/index');
const orders = require('./order/index');
const routes = require('./route/index');
const errorHandler = require('./error-handler/error-handler');
const path = require('path')

function createApp() {

  const app = express();
  app.use(express.json());

  app.use(express.static('public'));
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'));

  app.use('/', routes);
  app.use('/api/users', users);
  app.use('/api/products', products);
  app.use('/api/orders', orders);
  app.use(errorHandler())

  return app;
}

module.exports = createApp;