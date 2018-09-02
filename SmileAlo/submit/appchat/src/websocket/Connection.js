import lodash from 'lodash';
import {OrderedMap} from 'immutable';
import {message} from 'antd';
class Connection {
    constructor(store) {
        this.store = store;
        this.ws = null;
        this.isConnection = false;
        this.connectServer();
    }

    decodeMessage(message) {
        let mess;
        mess = JSON.parse(message);
        return mess;
    }

    ///message: token + header + data
    sendMessage(header, data){
        const store = this.store;
        const token = store.getCurrentToken;
        let message = {};
        message.token = token;
        message.header = header;
        message.data = data;
        const isConnection = this.isConnection;
        if(isConnection){
            const mess = JSON.stringify(message);
            this.ws.send(mess);
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    handleCreateChannel(data){
        const channelId = String(lodash.get(data, '_id'));
        const users = lodash.get(data, 'users');    
        const updated = new Date();
        let newChannel = {
            _id: channelId,
            title: lodash.get(data, 'title'),
            lastMessage: lodash.get(data, 'lastMessage'),
            avatar: lodash.get(data, 'avatar'),
            members: new OrderedMap(),
            messages: new OrderedMap(),
            isNew: false,
            userId: lodash.get(data, 'userId'),
            created: new Date(),
            updated: updated.getTime(),
            numberOfMessageWait: 0,
            isClick: false,
        }
        lodash.each(users, (user) => {
            this.store.addUserToCache(user);
            newChannel.members = newChannel.members.set(lodash.get(user, '_id'), user);
        })
        this.store.addChannel(channelId, newChannel);
    }

    //////////////////////////////////////////////////////////////////////////////

    handleCreateMessage(data){
        // const user = lodash.get(data, 'user');
        const userId = lodash.get(data, 'userId');
        const channelId = lodash.get(data, 'channelId');
        let newMessage = {
            _id: lodash.get(data, '_id'),
            channelId: channelId,
            body: lodash.get(data, 'body'),
            userId: userId,
            created: new Date(),
        };
        // this.store.addUserToCache(user);
        this.store.handleMessageReceiveToServer(newMessage);
        if(userId !== this.store.user._id && channelId !== this.store.getActiveChannelId){
            message.info("New a message: " + lodash.get(data, 'body') + " from " + '"' + this.store.getChannel(channelId).title + '"');
        }
    }
    /////////////////////////////////////////////////////////////////////////////

    handleUserOnline(data){
        this.store.updateStatus(data, true);
    }

    handleUserOffline(data){
        this.store.updateStatus(data, false);
    }

    handleListUserOnline(data){
        this.store.updateStatusListUser(data);
    }

    /////////////////////////////////////////////////////////////////////////////
    handelMessage(message){
        const header = lodash.get(message, 'header');
        const data = lodash.get(message, 'data');
        switch (header) {
            case 'listuser_online':
                this.handleListUserOnline(data);
                break;
            case 'user_online':
                this.handleUserOnline(data);
                break;
            case 'user_offline':
                this.handleUserOffline(data);
                break;
            case 'create_channel':
                this.handleCreateChannel(data);
                break;    
            case 'create_message':
                this.handleCreateMessage(data);
                break;               
            case 'unauthenticated':
                console.log("unauthenticated");
                this.store.setIsLogOut(true);
                break;         
            case 'authenticated':
                if(this.store.channels.size > 0){
                    this.store.setActiveChannelId(this.store.channels.first()._id);
                }
                break;
            default:
                break;
        }
    }

    //////////////////////////////////////////////////////////////////////////////

    connectServer(){
        const ws = new WebSocket('ws://localhost:3001');
        this.ws = ws;
        ws.onopen = () => {
            this.isConnection = true;
            this.store.sendAuthenUser();
        };

        ws.onmessage = (event) => {
            const message = this.decodeMessage(event.data);
            this.handelMessage(message);
        }

        ws.onclose = () => {
            console.log("disconnect");
            this.isConnection = false;
        }
    }
    disconnectServer(){
        this.ws.close();
    }
}

export default Connection;
