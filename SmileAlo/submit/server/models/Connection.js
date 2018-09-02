const { OrderedMap } = require('immutable');
const { ObjectId} = require('mongodb');
const lodash = require('lodash');
const token = require('../models/Token.js');

class Connection {
    constructor(app) {
        this.app = app;
        this.listConnections = new OrderedMap();
        this.model();

    }

    decodeMessage(message) {
        let mess;
        mess = JSON.parse(message);
        return mess;
    }

    sendMessage(ws, message) {
        const mess = JSON.stringify(message);
        ws.send(mess);
    }
    ////////////////////////////////////////////////////////////////////////

    handleCreateChannel(data){
        this.app.models.channels.createChannel(data).then((channel) => {
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
                _id: {
                    $in: listMemberId
                }
            };

            this.app.models.user.findUser(query, option).then((listUsers) => {
                channel.users = listUsers;
                lodash.each(listMemberId, (id) => {
                    const memberId = id.toString();
                    //get listSocket of member
                    let membersConnection = this.listConnections.filter((connection) => connection.userId === memberId);
                    if (membersConnection.size > 0) {
                        membersConnection.forEach((connection) => {
                            const ws = connection.ws;
                            const message = {
                                header: 'create_channel',
                                data: channel,
                            }
                            this.sendMessage(ws, message);
                        });
                    }
                });
                this.handleCreateMessage(lodash.get(data, 'message'));
            }).catch((err) => {
                console.log("error: ", err);
            })

        }).catch((err) => {
            console.log("error: ", err);
        });
    }
    ////////////////////////////////////////////////////////////////////////

    handleCreateMessage(data){
        this.app.models.messages.createMessage(data).then((objMessage) => {
            //add message vao trong channel chat do
            const channelId = String(lodash.get(objMessage, 'channelId'));
            this.app.models.channels.loadChannel(channelId).then((channel) => {
                const listMemberId = lodash.get(channel, 'members');
                lodash.each(listMemberId, (id) => {
                    const memberId = id.toString();
                    //get listSocket of member
                    let membersConnection = this.listConnections.filter((connection) => connection.userId === memberId);
                    if (membersConnection.size > 0) {
                        membersConnection.forEach((connection) => {
                            const ws = connection.ws;
                            const message = {
                                header: 'create_message',
                                data: objMessage,
                            };        
                            this.sendMessage(ws, message);
                        });
                    }
                });
            }).catch((err) => {
                console.log(err);
            })
        }).catch((err) => {
            console.log(err);
        })

    }

    sendAllUserOnline(message){
        this.listConnections.forEach((connection) => {
            let ws = connection.ws;
            this.sendMessage(ws, message)
        })
    }

    ////////////////////////////////////////////////////////////////////////
    getListUserOnline(userId){
        let listIdUser = [];
        this.listConnections.forEach((connection) => {
            let userIdTmp = connection.userId;
            if(userId !== userIdTmp){
                listIdUser.push(userIdTmp);
            }
        })
        return listIdUser;
    }
    ////////////////////////////////////////////////////////////////////////
    handleUpdateMessageWait(data){
        const channelId = lodash.get(data, 'channelId');
        const userId = lodash.get(data, 'userId');
        const query = {
            channelId: new ObjectId(channelId),
            userId: new ObjectId(userId),
        }
        this.app.models.channels.updateNumberOfMessageWait(query);
    }

    /////////////////////////////////////////////////////////////////////////
    handleAuthenticated(ws){
        const message = {
            header: 'authenticated',
            data: 'success connected websocket server'
        }
        this.sendMessage(ws, message);
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    handelMessage(socketId, header, data) {
        let clientConnection;
        switch (header) {
            case 'authenticated':
                console.log("authenticated");
                clientConnection = this.listConnections.get(socketId);
                clientConnection.userId = data;
                clientConnection.isOnline = true;

                // clientConnection.isAuthenticated = true;

                this.handleAuthenticated(clientConnection.ws);

                let message = {
                    header: 'user_online',
                    data: clientConnection.userId,
                }

                //gui user online ve cac may
                this.sendAllUserOnline(message);

                //gui list user online ve user moi dang nhap
                const listUserIdOnline = this.getListUserOnline(clientConnection.userId);
                message = {
                    header: 'listuser_online',
                    data: listUserIdOnline,
                }

                this.sendMessage(clientConnection.ws, message);
                // console.log("list User online: ", listUserIdOnline);
                break;

            case 'create_channel':
                this.handleCreateChannel(data);
                break;
            
            case 'create_message':
                this.handleCreateMessage(data);
                break;

            case 'update_messagewait':
                this.handleUpdateMessageWait(data);
                break;
            
            case 'logout':
                clientConnection = this.listConnections.get(socketId);
                clientConnection.isOnline = false;
            default:
                break;
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    model() {
        this.app.wss.on('connection', (ws) => {
            const socketId = new ObjectId().toString();
            console.log("client connect: ", socketId);
            const clientConnection = {
                _id: socketId,
                ws: ws,
                userId: null,
                isOnline: false
            }
            this.listConnections = this.listConnections.set(socketId, clientConnection);

            ws.on('message', (msg) => {
                const messageClient = this.decodeMessage(msg);

                const tokenObj = lodash.get(messageClient, 'token');
                //verify token
                token.verifyToken(tokenObj).then((result) => {
                    const header = lodash.get(messageClient, 'header');
                    const data = lodash.get(messageClient, 'data');
                    this.handelMessage(socketId, header, data);
                }).catch((err) => {
                    const connection = this.listConnections.get(socketId);
                    if (connection) {
                        let message = {
                            header: "unauthenticated",
                            data: "403",
                        }
                        this.sendMessage(connection.ws, message);
                    }
                })
            })

            ws.on('close', () => {
                console.log("disconnection to the server: ", socketId);
                const connection = this.listConnections.get(socketId);
                if(!connection){
                    return;
                }
                const userId = connection.userId;
                const message = {
                    header: 'user_offline',
                    data: userId,
                }
                this.listConnections = this.listConnections.remove(socketId);
                this.sendAllUserOnline(message);
            })
        });
    }
}

module.exports = Connection;
