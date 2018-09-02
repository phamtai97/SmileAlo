import React from 'react';
import iconGroupChat from '../../image/iconadd.png';
import iconAppChat from '../../image/iconapp.png';
import iconLogOut from '../../image/iconlogout.png'
import { inject, observer } from 'mobx-react';
import ObjectID from 'bson-objectid';
import { OrderedMap } from 'immutable';
import avatar from '../../image/avatar.jpg';
import '../../styles/MenuBar.css';
import lodash from 'lodash';
import {withRouter} from "react-router-dom";

@inject("store")
@observer
class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.onCreateChannel = this.onCreateChannel.bind(this);
        this.onLogoutApp = this.onLogoutApp.bind(this);
    }
    
    onCreateChannel() {
        const { store } = this.props;
        const channelId = new ObjectID().toString();
        const currentUser = store.getCurrentUser;
        const currentUserId = lodash.get(currentUser, '_id');
        const updated = new Date();

        const newChannel = {
            _id: channelId,
            title: "New Messenger",
            lastMessage: "",
            avatar: avatar,
            members: new OrderedMap(),
            messages: new OrderedMap(),
            isNew: true,
            userId: currentUserId,
            updated: updated.getTime(),
            created: new Date(),
        }   

        newChannel.members = newChannel.members.set(currentUserId, currentUser); 
        store.onCreateNewChannel(newChannel);
    }

    onLogoutApp(){
        const { store } = this.props;
        this.props.history.push('/');
        store.logout();
    }

    render() {
        console.log("menubar");
        return (
            <div className="menu-bar">
                <div className="menus">
                    <div className="icon-app">
                        <img src={iconAppChat} alt="avatar"/>
                    </div>

                    <div className="action-creategroup">
                        <img src={iconGroupChat} alt="avatar" onClick={this.onCreateChannel}/>
                    </div>

                    <div className="action-logout">
                        <img src={iconLogOut} alt="avatar"onClick={this.onLogoutApp}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MenuBar); //note
