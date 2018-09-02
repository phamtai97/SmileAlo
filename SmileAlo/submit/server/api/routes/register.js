const registerController = require('../controllers/registerController.js');

module.exports = function(app){
    app.route('/register')
        .post(registerController.register);
}   
