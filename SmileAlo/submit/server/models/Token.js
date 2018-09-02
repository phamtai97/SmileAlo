const jwt = require('jsonwebtoken');
const privateKey = 'secret';

const createToken = (userName) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ data: userName }, privateKey, { expiresIn: 60*60 },(err, token) => {
            return err ? reject(err) : resolve(token);
        });           
    })
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, privateKey, (err, decoded) => {
            return err ? reject(err) : resolve(decoded);
        });
    });
}

module.exports = { createToken, verifyToken }
