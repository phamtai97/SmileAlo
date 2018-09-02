const lodash = require('lodash');
search = (req, res) => {
    console.log("search: ", req.body);
    const keySearch = lodash.get(req, 'body.search');
    req.app.models.user.searchUserInDB(keySearch).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        return res.status(404).json(err);
    });
}
module.exports = { search };
