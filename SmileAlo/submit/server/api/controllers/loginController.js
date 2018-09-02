login = (req, res) => {
    const body = req.body;
    req.app.models.user.login(body).then((data) => {
        return res.status(200).json(data);
    }).catch((err) => {
        console.log("err: ", err);
        return res.status(401).json(err);
    });
}
module.exports = { login };
