const userController = require('../controllers/userController.js');

module.exports = function(app){
    app.route('/users')
        .post(userController.postUser);

    app.route('/users/:id')
        .get(userController.getUser);
}
