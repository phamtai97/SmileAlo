const middleware = require('../middlewares/middleware.js');
const channelController = require('../controllers/channelController.js');
module.exports = function (app) {
    app.use('/channels/:id', middleware.verify);  
    app.route('/channels/:id', middleware.verify)
        .get(channelController.getChannel);
        
    app.use('/allchannels', middleware.verify);  
    app.route('/allchannels', middleware.verify)
        .post(channelController.getAllChannelsUsers);
}
