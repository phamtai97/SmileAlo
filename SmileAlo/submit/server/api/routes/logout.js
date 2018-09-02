logoutController = require('../controllers/logoutController.js');
const middleware = require('../middlewares/middleware.js');
module.exports = function (app) {
    app.use('/logout', middleware.verify);  
    app.route('/logout', middleware.verify)
        .post(logoutController.logout);
}