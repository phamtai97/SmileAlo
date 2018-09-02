const lodash = require('lodash');
const helper = require('../helper/helper.js');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { OrderedMap } = require('immutable');
const token = require('../models/Token.js');

class User {
    constructor(app) {
        this.app = app;
        this.listUser = new OrderedMap();
    }

    checkUser(user, callback = () => {}) {
        const name = lodash.trim(lodash.get(user, 'name', ''));
        const userName = lodash.get(user, 'userName', '');
        const password = lodash.get(user, 'password', '');
        const avatar = lodash.trim(lodash.get(user, 'avatar', ''));

        let check = true;
        if (name.length < 1 || name.length > 20) {
            check = false;
        }

        if (!helper.isUserNameAndPassword(userName) || userName.length < 1 || userName.length > 20) {
            check = false;
        }

        if (!helper.isUserNameAndPassword(password) || password.length < 1 || password.length > 20) {
            check = false;
        }

        if (!helper.isImage(avatar)) {
            check = false;
        }
        if (!check) {
            const err = "Invalid value";
            return callback({
                error_message: err
            }, null);
        }

        //check username is exist in db
        this.app.db.collection('users').findOne({"userName": userName}, (err, result) => {
            if (err || result) {
                const err = "User is already exist";
                return callback({
                    error_message: err
                }, null);
            }
            const hashPassword = bcrypt.hashSync(password, 10);
            const userFormat = {
                name: name,
                userName: userName,
                password: hashPassword,
                avatar: avatar,
                created: new Date()
            }
            return callback(null, userFormat);
        });
    }

    createUser(user) {
        const db = this.app.db;
        return new Promise((resolve, reject) => {
            this.checkUser(user, (err, user) => {
                if (err) {
                    return reject(err);
                }
                db.collection('users').insertOne(user, (err, info) => {
                    if (err) {
                        return reject({
                            error_message: "Do not save user."
                        });
                    }
                    //save to cache
                    this.listUser = this.listUser.set(lodash.get(user, '_id'), user);
                    //tao token
                    token.createToken(lodash.get(user, 'userName')).then((tokenObj) => {
                        let data = {};
                        lodash.unset(user, 'password');
                        data.token = tokenObj;
                        data.user = user;

                        return resolve(data);
                    }).catch((err) => {
                        return reject({
                            error_message: "Login failed"
                        })
                    })
                });
            });
        });
    }

    findUserById(id, callback = () => {}) {
        if (!id) {
            const err = "User not found";
            return callback({
                message: err
            }, null);
        }
        const userId = new ObjectId(id);

        this.app.db.collection('users').findOne({_id: userId}, (err, result) => {
            if (err || !result) {
                const err = "User not found";
                return callback({message: err}, null);
            }
            return callback(null, result);
        });
    }

    loadUser(userId) {
        return new Promise((resolve, reject) => {
            const userTmp = this.listUser.get(userId);
            if (userTmp) {
                return resolve(userTmp);
            }
            this.findUserById(userId, (err, user) => {
                if (!err && user) {
                    this.listUser = this.listUser.set(userId, user);
                    return resolve(user);
                }
                return reject(err);
            })
        })
    }

    findUserByUserName(userName, callback = () => {}) {
        this.app.db.collection('users').findOne({userName: userName}, (err, result) => {
            if (err || !result) {
                const err = "User not found";
                return callback({
                    error_message: err
                }, null);
            }
            return callback(null, result);
        })
    }

    login(user) {
        const userName = lodash.get(user, 'userName');
        const password = lodash.get(user, 'password');
        return new Promise((resolve, reject) => {
            if (!userName || !password || !helper.isUserNameAndPassword(userName) || !helper.isUserNameAndPassword(password)) {
                const err = "Invalid value";
                return reject({
                    error_message: err
                });
            }
            this.findUserByUserName(userName, (err, result) => {
                if (err) {
                    return reject({
                        error_message: "Login failed"
                    });
                }
                const hashPassword = lodash.get(result, 'password');
                const check = bcrypt.compareSync(password, hashPassword);
                if (!check) {
                    return reject({
                        error_message: "Login failed"
                    });
                }
                //tao token
                token.createToken(lodash.get(result, 'userName')).then((tokenObj) => {
                    let data = {};
                    lodash.unset(result, 'password');
                    data.token = tokenObj;
                    data.user = result;
                    return resolve(data);
                }).catch((err) => {
                    return reject({
                        error_message: "Login failed"
                    })
                })
            });
        })
    }

    logout(userId){
        return new Promise((resolve, reject) => {
            return resolve("Logout success");
        })
    }

    searchUserInDB(keySearch){
        return new Promise((resolve, reject) => {
            const regex = new RegExp(keySearch, 'i');            
            this.app.db.collection('users').find({'name': {$regex : regex}}).toArray((err, result) => {
                    if(err || !result || result.length === 0){
                        return reject({
                            error_message : "User not found",
                        });
                    }        
                    lodash.unset(result, 'password');          
                    return resolve(result);
                })
            })
    }

    findUser(query, option){
        return new Promise((resolve, reject) => {
            this.app.db.collection('users').find(query, option).toArray((err, result) => {
                if(err || !result || result.length === 0){
                    return reject({
                        error_message : "User not found",
                    });
                } 
                return resolve(result);
            })
        })       
    }
}
module.exports = User;
