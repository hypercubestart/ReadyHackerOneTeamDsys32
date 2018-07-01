'use strict';

const bonnieController = require('./controllers');
const bonnieMiddleware = require('./middleware');

module.exports = (app) => {
  
  app.get('/ping', (req, res) => res.send('pong'));

  app.route('/user/login/').post(bonnieMiddleware.authenticate).post(bonnieController.login);
  app.route('/user/register/').post(bonnieController.register);
  app.route('/user/logout/').post(bonnieMiddleware.verifySession).post(bonnieController.logout);
  app.route('/user/authenticated/').get(bonnieMiddleware.verifySession).get((req, res) => res.status(200).end());

  
  app.route('/items/get/').get(bonnieMiddleware.verifySession).get(bonnieController.fetchItems);
  app.route('/order/place/').post(bonnieMiddleware.verifySession).post(bonnieController.placeOrder);
  
}
