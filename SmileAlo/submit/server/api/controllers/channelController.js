const lodash = require('lodash');
const { ObjectId } = require('mongodb');

getChannel = (req, res) => {
    const channelId = req.params.id;
    if(!channelId){
        return res.status(404).json(err);
    }
    req.app.models.channels.loadChannel(channelId).then((channel) => {
        const listMemberId = lodash.get(channel, 'members', []);
        const option = {
            fields:{
                _id: 1,
                name: 1,
                avatar: 1,
                created: 1,
            }
        }; 
        const query = {
            _id: { $in: listMemberId }
        }
        req.app.models.user.findUser(query, option).then((listUsers) =>{
            channel.users = listUsers;
            console.log(listUsers);
            return res.status(200).json(channel);
        }).catch((err) => {
            return res.status(404).json(err);
        })
    }).catch((err) => {
        return res.status(404).json(err);
    })
}

getAllChannelsUsers = (req, res) => {
    const userId = ObjectId(lodash.get(req, 'body.userId'));
    const query = [
        {
            $match: {
                members: {$all: [userId]},
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                lastMessage: 1,
                avatar: 1,
                members: 1,
                userId: 1,
                created: 1,
                updated: 1,
                users: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    created: 1,
                }
            }
        },
        {
            $sort: {
                updated: -1,
            }
        }
    ];


    req.app.models.channels.aggregateChannels(query).then((result) => {
        const option = {
            fields:{
                channelId: 1,
                userId: 1,
                numberOfMessageWait: 1,
            }
        };
        req.app.models.channels.getUserChannel({userId: userId}, option).then((user_channel) => {
            const message = {
                channels: result,
                user_channel: user_channel,
            }
            return res.status(200).json(message);
        }).catch((err) => {
            console.log("error: ", err);
            return res.status(404).json({error_message: "Not found"});
        })
    }).catch((err) => {
        return res.status(404).json({error_message: "Not found"});
    })
}

module.exports = { getChannel, getAllChannelsUsers };
