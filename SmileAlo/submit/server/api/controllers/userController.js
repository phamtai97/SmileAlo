const lodash = require('lodash');
postUser = (req, res) => {
    const body = req.body;
    req.app.models.user.createUser(body).then((user) => {
        lodash.unset(user, 'password');
        return res.status(200).json(user);
    }).catch((err) => {
        console.log("post error: ", err)
        return res.status(503).json(err);
    })
}

getUser = (req, res) => {
    const userId = req.params.id;
    if(!userId){
        return res.status(404).json(err);
    }
    req.app.models.user.loadUser(userId).then((user) => {
        lodash.unset(user,'password');
        return res.status(200).json(user);
    }).catch((err) => {
        console.log("get error: ", err)
        return res.status(404).json(err);
    })
}

module.exports = { postUser, getUser };
