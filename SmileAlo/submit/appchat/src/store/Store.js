import {OrderedMap} from 'immutable'
import lodash from 'lodash'
import { observable, computed, action } from "mobx";
import Api from '../api/Api';
import Connection from '../websocket/Connection.js';
import avatar from '../image/avatar.jpg';
import moment from 'moment';

class Store{
    @observable messages;
    @observable newMessage;
    @observable currentMessage; 

    @observable channels;
    @observable activeChannelId;

    @observable user;
    @observable listUsers;
    @observable listUsersSearch;
    @observable listUsersOnline;
    @observable nameUserSearch;
    @observable userSelected;
    
    @observable showComponentSearch;

    @observable token;

    @observable isLogout;

    constructor(){     
        this.connection = null;
        
        this.messages = new OrderedMap();
        this.newMessage = null;
        this.currentMessage = '';

        this.channels = new OrderedMap();
        this.activeChannelId = null;

        this.user = this.getUserFromLocalStorage;
        this.listUsers = new OrderedMap();
        this.listUsersSearch = new OrderedMap();
        this.listUsersOnline =  new OrderedMap();
        this.nameUserSearch = '';
        this.userSelected = null;

        this.showComponentSearch = false;

        this.Api = new Api();

        this.token = this.getTokenFromLocalStorage;
        
        if(this.token){
            this.getAllChannelsUsersFromDB();
            //this.connection = new Connection(this);
        }
        this.isLogout = false;

    }


    // /*------------------------------Handel Message-----------------------------*/
    @computed get getCurrentMessage(){
        return this.currentMessage;
    }

    @action setCurrentMessage = (message) => {
        this.currentMessage = message;
    }
    
    @computed get getNewMessage(){
        return this.newMessage;
    }

    @action setNewMessage(message){
        this.newMessage = message;
    }

    @action addMessage = (message) => {
        const channelId = message.channelId;
        if(channelId){
            let channel = this.channels.get(channelId);
            channel.lastMessage = message.body; 
            //gui channel ve server qua wss
            if(channel.isNew){
                channel.message = message;
                this.connection.sendMessage("create_channel", channel);
            }else { 
                this.connection.sendMessage("create_message", message);
            }
        }     
    }

    @action getMessagesFromChannel(channel) {
        let messagesTmp = new OrderedMap();
        
        if(channel){
            channel.messages.forEach((value, key) => {
                const message = this.messages.get(key);
                messagesTmp = messagesTmp.set(key, message);
            });
        }
        return messagesTmp.valueSeq();
    }

    @computed get getMessages() {
        return this.messages.valueSeq();    
    }

    @action handleMessageReceiveToServer = (message) => {
        const userSendId = lodash.get(message, 'userId');
        const userSend = this.listUsers.get(userSendId);
        const messageId = lodash.get(message, '_id');
        const channelId = lodash.get(message, 'channelId');
        const isMe = userSendId === lodash.get(this.user, '_id') ? true : false;
        
        message.me = isMe;
        message.user = userSend;
        this.messages = this.messages.set(messageId, message);
        
        if(channelId){
            let channel = this.channels.get(channelId);
            this.currentMessage = message.body;
            channel.lastMessage = message.body;
            channel.messages = channel.messages.set(messageId, true);
            if(channel._id !== this.activeChannelId){
                let number = channel.numberOfMessageWait;
                channel.numberOfMessageWait = number + 1;             
            }else{
                if(!isMe){
                    channel.numberOfMessageWait = 0;
                    let message = {
                        channelId: channelId,
                        userId: this.user._id,
                    }
                    this.connection.sendMessage("update_messagewait", message);
                }    
            }
            this.channels = this.channels.set(channelId, channel); 
        }
    }

    @action getAllMessageInChannelFromDB = (channelId) => {
        let message = {};
        message.token = this.token;
        message.channelId = channelId;
        this.Api.post('allmessages', message).then((response) => {
            const messages = lodash.get(response, 'data');
            lodash.each(messages, (message) => {
                this.handleMessageReceiveToServer(message);
            })
        }).catch((err) => {
            console.log(err);
            //xu li logout
            const error = lodash.get(err, 'response.status');
            if(error === 403){
                this.isLogout = true;
            }
        })
    }

    // /*------------------------------Handel channel-----------------------------*/
    renderAvatarContent(channel) {
        if (!channel) {
            return null;
        }
        const listMembers = this.getMembersFromChannel(channel);
        listMembers.forEach((member) => {
            channel.avatar = member.avatar;
        })
        return channel.avatar;
    }

    renderTilteContent(channel) {
        if (!channel) {
            return null;
        }
        const members = this.getMembersFromChannel(channel);
        let nameChannle = [];
        members.forEach((member) => {
            nameChannle.push(lodash.get(member, 'name'));
        });
        channel.title = lodash.join(nameChannle, ', ');

        if (channel.title.length === 0) {
            channel.title = "New Messenger";
        }
        return channel.title;
    }

    @action addChannel = (id, channel) => {
        if(!channel.isNew){
            channel.avatar = this.renderAvatarContent(channel);
            channel.title = this.renderTilteContent(channel);
            if(this.channels.size === 1){
                this.activeChannelId = id; 
                channel.isClick = true;
            }
            this.channels = this.channels.set(id, channel);
            this.channels = this.channels.sort((a, b) => {
                if(a.updated < b.updated) return 1;
                if(a.updated > b.updated) return -1;
                return 0;});
        }else{     
            this.activeChannelId = id; 
            this.channels = this.channels.set(`${id}`, channel);
            this.channels = this.channels.sort((a, b) => {
                if(a.updated < b.updated) return 1;
                if(a.updated > b.updated) return -1;
                return 0;});
        }    
    }

    @computed get getChannels() {
        return this.channels.valueSeq();
    }

    @computed get getActiveChannel () {
        const channel = this.activeChannelId ? this.channels.get(this.activeChannelId) : this.channels.first();
        return channel;
    }

    @action setActiveChannelId = (channelId) => {
        this.activeChannelId = channelId;
        let activeChannel = this.getActiveChannel;
        if(!activeChannel){
            return;
        }
        activeChannel.numberOfMessageWait = 0;
        this.channels = this.channels.set(channelId, activeChannel);
        if(!activeChannel.isClick){
            this.getAllMessageInChannelFromDB(channelId);
            activeChannel.isClick = true;
            this.channels = this.channels.set(activeChannel._id, activeChannel);
        }

        const message = {
            channelId: channelId,
            userId: lodash.get(this.user, '_id'),
        };
        //update numberofMessageWait in Db
        this.connection.sendMessage("update_messagewait", message);
    }

    @computed get getActiveChannelId() {
        const channelId = this.activeChannelId;
        return channelId;
    }

    @action onCreateNewChannel = (channel ={}) => {
        if(this.listUsersSearch.size !== 0){
            this.listUsersSearch = this.listUserSearch.clear();            
        }
        const id = lodash.get(channel, '_id');
        this.addChannel(id, channel);
    }

    @action onCancelChannel = (channelId) => {
        this.channels = this.channels.remove(channelId);
        if(this.listUsersSearch.size > 0){
            this.listUsersSearch = this.listUserSearch.clear();
        }
        this.showComponentSearch = false;
    }

    @action addUserToChannel = (channelId, user) => {
        const channel = this.channels.get(channelId);
        if(channel){
            channel.members = channel.members.set(user._id, user);
            this.channels.set(channelId, channel);
        }
    }

    handleChannelReceiveFromServer = (channel) => {
        const channelId = String(lodash.get(channel, '_id'));
        const users = lodash.get(channel, 'users');
        const updated = new Date(moment.utc(lodash.get(channel, 'updated')).format());

        // console.log("updated.getTime: ", updated.getTime());
        let newChannel = {
            _id: channelId,
            title: '',
            lastMessage: lodash.get(channel, 'lastMessage'),
            avatar: '',
            members: new OrderedMap(),
            messages: new OrderedMap(),
            isNew: false,
            userId: lodash.get(channel, 'userId'),
            created: lodash.get(channel, 'created'),
            updated: updated.getTime(),
            numberOfMessageWait: lodash.get(channel, 'numberOfMessageWait'),
            isClick: false,
        }
        lodash.each(users, (user) => {
            this.addUserToCache(user);
            this.listUsersOnline = this.listUsersOnline.set(user._id, false);
            newChannel.members = newChannel.members.set(lodash.get(user, '_id'), user)
        })

        const avatar = this.renderAvatarContent(newChannel);
        const title = this.renderTilteContent(newChannel);
        newChannel.avatar = avatar;
        newChannel.title = title;
        if (newChannel.title.length === 0) {
            newChannel.title = "New Messenger";
        }
        return newChannel;
    }

    @action getAllChannelsUsersFromDB = () => {
        let message = {};
        const userId = lodash.get(this.user, '_id');
        message.token = this.token;
        message.userId = userId;
        let channelsTmp = new OrderedMap();
        let channelTmp = {};
        this.Api.post('allchannels', message).then((response) => {
            const channels = lodash.get(response, 'data.channels');
            const user_channel = lodash.get(response, 'data.user_channel');

            if(channels.length > 0){
                lodash.each(channels, (channel) => {
                    lodash.each(user_channel, (element) => {
                        if(channel._id === element.channelId){
                            channel.numberOfMessageWait = element.numberOfMessageWait;
                            channelTmp = this.handleChannelReceiveFromServer(channel);
                            channelsTmp = channelsTmp.set(lodash.get(channelTmp, '_id'), channelTmp);
                        }
                    })
                })          
                this.channels = channelsTmp;
            }  
            /*--------------------------------connect websocker server-------------------------------------*/   
            this.connection = new Connection(this);  

        }).catch((err) => {
            console.log(err);
            //xu li logout
            const error = lodash.get(err, 'response.status');
            if(error === 403){
                this.isLogout = true;
            }
        })
    }

    @action getChannel(channelId){
        return this.channels.get(channelId);
    }

    /*------------------------------Handel member-----------------------------*/
    @action getMembersFromChannel(channel) { 
        let membersTmp = new OrderedMap();
        let userId = this.user._id;
        if(channel){
            channel.members.map((member, key) => {
                let memberId = member._id;
                if(userId !== memberId){             
                    membersTmp = membersTmp.set(key, member);
                }              
            });
        }
        return membersTmp.valueSeq();
    }

    @action getSizeMembersInChannel = (channel) => {
        if(!channel){
            return 0;
        }
        const members = lodash.get(channel, 'members');
        return members.size;
    }

    @action removeMemberToChannel = (channel, member) => {
        const memberId = lodash.get(member, '_id');
        const channelId = lodash.get(channel, '_id');
        channel.members = channel.members.remove(memberId);
        if(channel.members.size === 1){
            channel.avatar = avatar;
            channel.title = 'New Messenger';
        }
        this.channels = this.channels.set(channelId, channel);
    }
    
    /*----------------------------------Handel user-------------------------------*/
    @computed get getCurrentUser(){
        return this.user;
    }

    @action setCurrentUser = (user) => {
        this.user = user;
        if(user){
            localStorage.setItem('me', JSON.stringify(user));       
            this.listUsers = this.listUsers.set(lodash.get(user,'_id'), user);   
        }
    }

    @computed get getUserFromLocalStorage(){
        let user = null;
        const data = localStorage.getItem('me');
        if(data){
            user = JSON.parse(data);
        }
        return user;
    }

    @action addUserToCache = (user) => {
        this.listUsers = this.listUsers.set(lodash.get(user, '_id'), user);
        //return user;
    }

    @computed get getListUsers(){
        return this.listUsers;
    }

    @action getUserInCache = (userId) => {
        return this.listUsers.get(userId);
    }
    
    /*--------------------------------------handle token---------------------------------*/
    @action setUserToken = (token) => {
        this.token = token;
        if(token){
            localStorage.setItem('token', JSON.stringify(token));        
        }
    }

    @computed get getTokenFromLocalStorage(){
        let token = null;
        const data = localStorage.getItem('token');
        if(data){
            token = JSON.parse(data);
        }
        return token;
    }

    @computed get getCurrentToken(){
        return this.token;
    }
    /*----------------------------------handle Search user------------------------------*/
    searchNameUserInChannels(name){
        let listUsersSearchTmp = new OrderedMap();
        const userCurrentId = this.user._id;
        this.channels.forEach((channelElement) => {
            name = name.toLowerCase();
            let title = String(channelElement.title).toLowerCase();
            if(title.startsWith(name)){
                let id = channelElement._id;
                if(id !== userCurrentId){
                    listUsersSearchTmp = listUsersSearchTmp.set(id, channelElement);
                }
            }
        });
        return listUsersSearchTmp;
    }

    @action searchNameUserChat = () => {
        let name = this.nameUserSearch;
        this.listUserSearch = this.listUsersSearch.clear();
        return new Promise((resolve, reject) => {
            if(!name){
                return reject(null);
            }
            const channel = this.getActiveChannel;
            const userCurrentId = this.user._id;

            if(!channel){
                this.listUserSearch = this.listUsersSearch.clear();
                this.showComponentSearch = false;
                reject(404);
            }

            //search in list channel
            if(!channel.isNew){
                let listUsersSearchTmp = new OrderedMap();
                listUsersSearchTmp = this.searchNameUserInChannels(name);
                if(listUsersSearchTmp.size > 0){
                    resolve(listUsersSearchTmp)
                }else{
                    this.listUserSearch = this.listUsersSearch.clear();
                    this.showComponentSearch = false;
                    reject(404);
                }
            }

            //search in DB
            let message = {};
            message.token = this.token;
            message.search = name;
            let listUsersSearchTmp = new OrderedMap();
            //goi API
            this.Api.post('search', message).then((response) => {
                const tmp = lodash.get(response, 'data', []);
                tmp.forEach((user) => {
                    let id = user._id;
                    if(id !== userCurrentId){
                        listUsersSearchTmp = listUsersSearchTmp.set(user._id, user);
                    }
                });
                return resolve(listUsersSearchTmp);

            }).catch((err) => {
                const error = lodash.get(err, 'response.status');
                this.listUserSearch = this.listUsersSearch.clear();
                this.showComponentSearch = false;
                return reject(error)
            });
        }) 
    }

    @computed get getListUsersSearch() {
        return this.listUsersSearch.valueSeq();
    }

    @action setListUsersSearch = (list) => {
        this.listUsersSearch = list;
    }

    @action clearListUsersSearch = () => {
        this.listUsersSearch = this.listUsersSearch.clear();
    }

    @action setNameUserSearch = (nameUserSearch) => {
        this.nameUserSearch = nameUserSearch;
    }

    @computed get getNameUserSearch(){
        return this.nameUserSearch;
    }

    /*-------------------------------handle showComponentSearch--------------------------*/
    @action setShowComponentSearch = (bool) => {
        this.showComponentSearch = bool;
    }

    @computed get getShowComponentSearch(){
        return this.showComponentSearch;
    }

    /*---------------------------------handle user selected------------------------------*/
    @action setUserSelected(userSelected){
        this.userSelected = userSelected;
    }

    @computed get getUserSelected(){
        return this.userSelected;
    }

    /*--------------------------------handel submit login logout register----------------------------------*/
    loginApp(userName, password){
        const user = {
            userName: userName,
            password: password
        }
        return new Promise((resolve, reject) => {
            this.Api.post('login', user).then((response) => {
                const data = response.data;
                const token = lodash.get(data, 'token');
                const user = lodash.get(data, 'user');
                this.setCurrentUser(user);
                this.setUserToken(token);
                this.getAllChannelsUsersFromDB(); 
                return resolve(data);
            }).catch((err) => {
                const error = lodash.get(err, 'response.status');
                return reject(error);
            })
        })
    }

    connectServerWebSocket(){
        this.connection = new Connection(this);     
    }

    sendAuthenUser(){
        this.connection.sendMessage("authenticated", lodash.get(this.user, '_id'));
    }
    
    @action logoutApp = () => {
        this.listUsers = this.listUsers.remove(lodash.get(this.user, '_id'));
        localStorage.removeItem('me');
        localStorage.removeItem('token');
        const message = {
            token: this.token,
            userId: this.user._id,
        }
        this.connection.sendMessage("logout", message);
        //disconnect server 
        this.connection.disconnectServer();
        //xoa het du lieu
        this.listUsers = this.listUsers.clear();
        this.channels = this.channels.clear();
        this.messages = this.messages.clear();
        this.listUsersOnline = this.listUsersOnline.clear();
        //send api
        // this.Api.post('logout', message).then((response) =>{
        //     console.log(response.data);
        // }).catch((err) => {
        //     console.log(err);
        // })

        this.user = null;
    }

    @action logout = () => {
        this.listUsers = this.listUsers.remove(lodash.get(this.user, '_id'));
        localStorage.removeItem('me');
        localStorage.removeItem('token');
        this.connection.sendMessage("logout", this.user._id);
        //disconnect server 
        this.connection.disconnectServer();
        //xoa het du lieu
        this.listUsers = this.listUsers.clear();
        this.channels = this.channels.clear();
        this.messages = this.messages.clear();
        this.listUsersOnline = this.listUsersOnline.clear();
        this.user = null;
    }


    register(user){
        return new Promise((resolve, reject) => {
            this.Api.post('register', user).then((response) => {
                const data = response.data;
                const token = lodash.get(data, 'token');
                const user = lodash.get(data, 'user');
                this.setCurrentUser(user);
                this.setUserToken(token);
                this.connection = new Connection(this);
                return resolve(data);
            }).catch((err) => {
                const error = lodash.get(err, 'response.status');
                console.log(lodash.get(err, 'response'))
                return reject(error);
            })
        })
    }

    /*---------------------------------------update status list user online -------------------------------------*/
    @action updateStatus = (userId, bool = false) => {
        this.listUsersOnline = this.listUsersOnline.set(userId, bool);
    }

    @action updateStatusListUser = (listUserIdOnline) => {
        listUserIdOnline.forEach((userId) => {
            this.updateStatus(userId, true);      
        })
    }

    @action getUserOnline = (userId) =>{
        return this.listUsersOnline.get(userId);
    } 

    @computed get getListUsersOnline(){
        return this.listUsersOnline;
    }

    /*--------------------------------------log out------------------------------------------*/
    @computed get getIsLogOut(){
        return this.isLogout;
    }

    @action setIsLogOut = (bool) => {
        this.isLogout = bool;
    }
}

const store = new Store();
export default store;
