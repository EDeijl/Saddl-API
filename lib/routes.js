'use strict';

var api = require('./controllers/api'),
    route = require('./controllers/route'),
    passport = require('passport'),
    order = require('./controllers/order'),
    courier = require('./controllers/courier'),
    message = require('./controllers/message'),
    index = require('./controllers'),
    token = require('./controllers/token'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  //app.route('/api/google')
    //.get(api.google);

  app.route('/api/routes')
    .get(route.getRoutes)
    .post(route.create);

  app.route('/api/routes/:id')
    .get(route.getById);

  app.route('/api/orders')
    .get(passport.authenticate('bearer', {session: false}), order.getOrders)
    .post( order.create);

  app.route('/api/couriers')
    .get(courier.couriers);

  app.route('/api/courier/location')
    .post(courier.setLocation);

  app.route('/api/orders/:id')
    .get(order.getById);

  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/token')
    .post(token.getToken);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);
  app.route('/api/message')
    .get(message.getAll)
    .post(message.createMessage);
  app.route('/api/message/:courier')
    .get(message.getByCourier);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};
