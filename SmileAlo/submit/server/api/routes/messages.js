const middleware = require('../middlewares/middleware.js');
const messageController = require('../controllers/messageController.js');
module.exports = function (app) {
    app.use('/allmessages', middleware.verify);  
    app.route('/allmessages', middleware.verify)
        .post(messageController.getAllMessagesChannels);
}
