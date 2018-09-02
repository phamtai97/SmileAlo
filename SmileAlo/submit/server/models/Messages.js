const { OrderedMap } = require('immutable');
const { ObjectId } = require('mongodb');
const lodash = require('lodash');

class Messages{
    constructor(app){
        this.app = app;
        this.listMessages = new OrderedMap();
    }

    createMessage(objMessage){
        return new Promise((resolve, reject) => {
            let _id = "" + lodash.get(objMessage, '_id');
            let messageId = _id ? new ObjectId(_id) : new ObjectId();
            const userId = ObjectId(lodash.get(objMessage, 'userId')); 
            const channelId = ObjectId(lodash.get(objMessage, 'channelId'));
            const body =  lodash.get(objMessage, 'body');
            const message = {
                _id: messageId,
                channelId: channelId,
                body: body,
                userId: userId,
                created: new Date(),
            };
            //save db
            this.app.db.collection('messages').insertOne(message, (err, result) => {
                if(err){
                    return reject(err);
                }
                if(!err){
                    //update vào collection channel
                    this.app.db.collection('channels').findOneAndUpdate({_id: channelId}, {
                        $set: {
                            lastMessage: body,
                            updated: new Date()
                        }
                    })
                    
                    //update number message wait in db
                    this.app.models.channels.getUserChannel({channelId: channelId}, {}).then((listUserChannel) => {
                        listUserChannel.forEach(element => {
                            if(String(userId) !== String(element.userId)){
                                let number = element.numberOfMessageWait;
                                number = number + 1;
                                this.app.db.collection('user_channel').findOneAndUpdate({_id: element._id}, {
                                    $set:{
                                        numberOfMessageWait: number,
                                    }
                                })
                            } 
                        });
                    }).catch((err) => {
                        console.log("error: ", err);
                    })

                    //save cache
                    this.listMessages = this.listMessages.set(messageId, message);

                    this.app.models.user.loadUser(userId).then((user) => {
                        lodash.unset(user, 'userName');
                        lodash.unset(user, 'password');
                        // message.user = user;
                        return resolve(message);
                    }).catch((err) => {
                        return reject(err);
                    })
                }
                
            });
        });
    }


    getAllMessagesInChannel(query){
        return new Promise((resolve, reject) => {    
            this.app.db.collection('messages').aggregate(query).toArray((err, result) => {
                return err ? reject({error_message: "Not found"}) : resolve(result);
            })
        })
    }
}

module.exports = Messages;
