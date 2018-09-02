const lodash = require('lodash');
const register = (req, res) => {
    const body = req.body;
    req.app.models.user.createUser(body).then((data) => {
        return res.status(200).json(data);
    }).catch((err) => {
        console.log("post error: ", err)
        return res.status(400).json(err);
    })
}

module.exports = { register};
