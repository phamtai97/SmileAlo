const mongodbClient = require('mongodb').MongoClient;
const config = require('../config/config.js');

connect = () => {
    return new Promise((resolve, reject) => {
        mongodbClient.connect(config.database.url, config.database.option, (err, client) => {
            const db = client.db('chatapp');
            err ? reject(err) : resolve(db);
        });
    })
}

module.exports = { connect };