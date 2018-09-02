const middleware = require('../middlewares/middleware.js');
const searchController = require('../controllers/searchController.js');
module.exports = function (app) {
    app.use('/search', middleware.verify);  
    app.route('/search', middleware.verify)
        .post(searchController.search);
}
