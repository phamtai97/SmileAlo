import React from 'react';
import { inject, observer } from 'mobx-react';
import lodash from 'lodash';
import SearchUser from '../chatpage/SearchUser.jsx';
import '../../styles/MainContent.css';
import {withRouter} from "react-router-dom";
import moment from 'moment';

@inject("store")
@observer
class MainContent extends React.Component {
    constructor(props) {
        super(props);
        this.renderMessage = this.renderMessage.bind(this);
        this.scrollMessageToBottom = this.scrollMessageToBottom.bind(this);
    }

    renderMessage(message) {
        const tmp = message.body;
        const html = lodash.split(tmp, '\n').map((text, key) => {
            return <div key={key} dangerouslySetInnerHTML={{ __html: text }} />
        })
        return html;
    }

    scrollMessageToBottom() {
        if (this.refMessage) {
            this.refMessage.scrollTop = this.refMessage.scrollHeight;
        }
    }

    componentDidUpdate() {
        this.scrollMessageToBottom();
    }

    onLogoutApp(){
        const { store } = this.props;
        this.props.history.push('/');
        store.logoutApp();
    }

    render() {
        const { store } = this.props;
        console.log("Main content");
        const isLogOut = store.getIsLogOut;
        const size = store.messages.size;
        if(isLogOut){
            this.onLogoutApp();
        }
        return (
            (lodash.get(store.getActiveChannel, 'isNew') || store.getShowComponentSearch) ?
                <SearchUser></SearchUser>
                :
                <div ref={(refe) => { this.refMessage = refe }} className="messages">
                    {store.getMessagesFromChannel(store.getActiveChannel).map((message, index) => {
                        const userId = lodash.get(message, 'userId');
                        const user = store.getUserInCache(userId);
                        return (
                            (message.me ? 
                            <div key={index} className="message-me">
                                <div className="message-body-me">
                                    <div className='message-text-me'>
                                        {this.renderMessage(message)}
                                    </div>
                                    <div className ="created-message">
                                        <div>{moment(message.created).format('MM/DD/YY, HH:mm')}</div>
                                    </div>
                                </div>
                                <div className="message-user-image">
                                    <img src={lodash.get(user, 'avatar')} alt="avatar" />
                                </div>
                            </div>
                            :
                            <div key={index} className="message">
                                <div className="message-user-image">
                                    <img src={lodash.get(user, 'avatar')} alt="avatar" />
                                </div>
                                <div className='message-body'>
                                    <div className='message-author'>
                                        {lodash.get(user,'name')}
                                    </div>
                                    <div className='message-text'>
                                        {this.renderMessage(message)}
                                    </div>
                                    <div className ="created-message">
                                        <div>{moment(message.created).format('MM/DD/YY, HH:mm')}</div>
                                    </div>
                                </div>
                            </div>
                            )
                        );
                    })}
                </div>
        )
    }
}

export default withRouter(MainContent);
