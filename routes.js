'use strict';

const bonnieController = require('./controllers');
const bonnieMiddleware = require('./middleware');

module.exports = (app) => {
  
  app.get('/ping', (req, res) => res.send('pong'));

  // app.route('/groups/nearby/').get(killfeedController.nearbyGroups);

}
