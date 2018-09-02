loginController = require('../controllers/loginController.js');

module.exports = function(app){
    app.route('/login')
        .post(loginController.login);
}   
