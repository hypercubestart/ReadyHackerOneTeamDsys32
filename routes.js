'use strict';

const bonnieController = require('./controllers');
const bonnieMiddleware = require('./middleware');

module.exports = (app) => {
  
  app.get('/ping', (req, res) => res.send('pong'));

  app.route('/user/login/').post(bonnieMiddleware.authenticate).post(bonnieController.login);
  app.route('/user/register/').post(bonnieController.register);
  app.route('/user/logout/').post(bonnieMiddleware.verifySession).post(bonnieController.logout);
  app.route('/user/authenticated/').get(bonnieMiddleware.verifySession).get((req, res) => res.status(200).end());
  app.route('/user/get').get(bonnieMiddleware.verifySession).get(bonnieController.fetchUser);
  // TODO: add a change-password route if we have time
  
  app.route('/item/get/').get(bonnieMiddleware.verifySession).get(bonnieController.fetchItems);
  app.route('/order/place/').post(bonnieMiddleware.verifySession).post(bonnieController.placeOrder);

  // staff routes
  app.route('/staff/login/').post(bonnieMiddleware.authenticateStaff).post(bonnieController.login);
  app.route('/staff/register/').post(bonnieMiddleware.verifyStaffSession).post(bonnieController.registerStaff);
  app.route('/staff/logout/').post(bonnieMiddleware.verifyStaffSession).post(bonnieController.logout);
  
  app.route('/order/get/').get(bonnieMiddleware.verifyStaffSession).get(bonnieController.fetchOrders);
  app.route('/order/fulfill/').post(bonnieMiddleware.verifyStaffSession).post(bonnieController.fulfillOrder);
  app.route('/order/cancel/').post(bonnieMiddleware.verifyStaffSession).post(bonnieController.cancelOrder);
  app.route('/order/export/').get(bonnieMiddleware.verifyStaffSession).get(bonnieController.exportOrders);

  app.route('/item/add/').post(bonnieMiddleware.verifyStaffSession).post(bonnieController.addItem);
  app.route('/item/remove/').post(bonnieMiddleware.verifyStaffSession).post(bonnieController.removeItem);

}
