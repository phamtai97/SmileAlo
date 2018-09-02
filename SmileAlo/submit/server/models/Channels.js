const { OrderedMap } = require('immutable');
const { ObjectId } = require('mongodb');
const lodash = require('lodash');

class Channels{
    constructor(app){
        this.app = app;
        this.listChannels = new OrderedMap();
    }

    loadChannel(channelId){
        return new Promise((resolve, reject) => {
            const channelTmp = this.listChannels.get(channelId);
            if (channelTmp) {
                return resolve(channelTmp);
            }
            this.findChannelById(channelId, (err, channel) => {
                if (!err && channel) {
                    this.listChannels = this.listChannels.set(channelId, channel);
                    return resolve(channel);
                }
                return reject(err);
            })
        })
    }

    findChannelById(id, callback = () => {}){
        if (!id) {
            const err = "Channel not found";
            return callback({ message: err }, null);
        }
        const channelId = new ObjectId(id);
        this.app.db.collection('channels').findOne({_id: channelId}, (err, result) => {
            if (err || !result) {
                const err = "Channel not found";
                return callback({message: err}, null);
            }
            return callback(null, result);
        });

    }

    createChannel(objChannel){
        return new Promise((resolve, reject) => {
            let _id = "" + lodash.get(objChannel, '_id');
            let channelId = _id ? new ObjectId(_id) : new ObjectId();

            let members = [];
            lodash.each(lodash.get(objChannel, 'members', []), (value, key) => {
                members.push(ObjectId(key));
                let userId = ObjectId(key);
                let user_channel = {
                    channelId: channelId,
                    userId: userId,
                    numberOfMessageWait: 0,
                }
                //save db
                this.app.db.collection('user_channel').insertOne(user_channel, (err, result) => {
                    lodash.unset(user_channel, "_id");
                    console.log("error insert user_channel: ", err)
                })
            });

            const channel = {
                _id: channelId,
                title: '',
                lastMessage: lodash.get(objChannel, 'lastMessage'),
                avatar: lodash.get(objChannel, 'avatar'),
                members: members,
                userId: ObjectId(lodash.get(objChannel, 'userId')),
                created: new Date(),
            };
            //save channel
            this.app.db.collection('channels').insertOne(channel, (err, result) => {
                if(!err){
                    //save cache 
                    this.listChannels = this.listChannels.set(String(lodash.get(channel, '_id')), channel);
                } 
                return err ? reject(err) : resolve(channel);
            });
        });
    }

    findChannels(query, option = {}){
        return new Promise((resolve, reject) => {
            this.app.db.collection('channels').find(query, option).toArray((err, result) => {
                if(err || !result || result.length === 0){
                    return reject({
                        message : "Channel not found",
                    });
                } 
                return resolve(result);
            })
        })
    }

    aggregateChannels(query){
        return new Promise((resolve, reject) => {
            this.app.db.collection('channels').aggregate(query).toArray((err, result) => {
                return err ? reject(err) : resolve(result);
            })
        })
    } 

    updateNumberOfMessageWait(query){
        // console.log("update: ", query);
        this.app.db.collection('user_channel').findOneAndUpdate(query, { $set: {numberOfMessageWait: 0}});
    }
    
    //khi login gui tat ca tn wait cua channel ma user co
    getUserChannel(query, option = {}) {
        return new Promise((resolve, reject) => {
            this.app.db.collection('user_channel').find(query).toArray((err, result) => {
                return err ? reject(err) : resolve(result);
            })
        })
    }
}
module.exports = Channels;
