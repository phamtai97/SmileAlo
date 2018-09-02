import React from 'react';
import '../../styles/SearchUser.css'
import { inject, observer } from 'mobx-react';
import '../../styles/MessageInput.css';
import ObjectId from 'bson-objectid';
import '../../styles/MessageInput.css';
import Lodash from 'lodash'

@inject("store")
@observer
class MessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleSend = this.handleSend.bind(this);
    }

    handleSend() {
        const { store } = this.props;
        const newMessage = store.getNewMessage;
        if (newMessage && newMessage.trim().length > 0) {
            const messageId = new ObjectId().toString();
            const channel = store.getActiveChannel;
            if(!channel || channel.title === "New Messenger"){
                store.setNewMessage('');
                return;
            }
            
            const user = store.getCurrentUser;
            const message = {
                _id: messageId,
                channelId: channel._id,
                body: newMessage,
                userId: Lodash.get(user, '_id'),
                me: true,
            };    
            store.addMessage(message);
            store.setNewMessage('');
        }
    }

    render() {
        console.log("message input");
        const {store} = this.props;
        return (
            <div className="message-input">
                <div className="text-input">
                    <textarea onKeyUp={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            this.handleSend();
                        }
                    }}
                        onChange={(event) => {
                            store.setNewMessage(event.target.value);
                        }} value={store.getNewMessage || ''} placeholder="Write your message..." />
                </div>

                <div className="action-send">
                    <button onClick={this.handleSend} className="send">Send</button>
                </div>
            </div>
        )
    }
}

export default MessageInput;