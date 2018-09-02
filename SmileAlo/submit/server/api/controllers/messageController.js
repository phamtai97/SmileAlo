const lodash = require('lodash');
const { ObjectId } = require('mongodb');

getAllMessagesChannels = (req, res) => {
    const channelId = ObjectId(lodash.get(req, 'body.channelId'));
    const query = [
        {
            $match: {
                channelId: channelId,
            }
        },
        {
            $sort: {
                _id: 1,
            }
        }
    ]

    req.app.models.messages.getAllMessagesInChannel(query).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        return res.status(404).json(err);
    })
}

module.exports = { getAllMessagesChannels };
