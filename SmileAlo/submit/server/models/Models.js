const User = require('./User.js');
const Connection = require('./Connection.js');
const Channels = require('./Channels.js');
const Messages = require('./Messages.js');

class Models{
    constructor(app){
        this.app = app;
        this.user = new User(app);
        this.connection = new Connection(app);
        this.channels = new Channels(app);
        this.messages = new Messages(app);
    }
}

module.exports = Models;
