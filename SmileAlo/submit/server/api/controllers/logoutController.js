const lodash = require('lodash');
logout = (req, res) => {
    const userId = lodash.get(req, 'body.userId');
    req.app.models.user.logout(userId).then((result) => {
        console.log("logout: ", result);
        return res.status(200).json(result);
    }).catch((err) => {
        return res.status(403).json(err);
    });
}
module.exports = { logout };