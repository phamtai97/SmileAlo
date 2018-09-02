const lodash = require('lodash');
const token = require('../../models/Token.js');

verify = (req, res, next) => {
    const tokenObj = lodash.get(req, 'body.token');
    token.verifyToken(tokenObj).then((result) => {
        next();
    }).catch((err) => {
        return res.status(403).json(err);
    });
}
module.exports = { verify }
