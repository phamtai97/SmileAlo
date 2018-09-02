import React from 'react';
import '../../styles/SearchUser.css'
import { inject, observer } from 'mobx-react';
import Lodash from 'lodash';

@inject("store")
@observer
class SearchUser extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickUserChat = this.handleClickUserChat.bind(this);
    }

    handleClickUserChat(user, store) {
        store.setUserSelected(user);
        const activeChannel = store.getActiveChannel;
        if (Lodash.get(activeChannel, 'isNew')) {
            activeChannel.avatar = user.avatar;
            const channelId = Lodash.get(activeChannel, '_id');
            store.addUserToChannel(channelId, user);
            store.setShowComponentSearch(false);
            store.setNameUserSearch('');
            store.clearListUsersSearch();
        }
        if (store.getShowComponentSearch && !Lodash.get(activeChannel, 'isNew')) {
            store.setShowComponentSearch(false);
            store.setNameUserSearch('');
            store.clearListUsersSearch();
            store.setActiveChannelId(store.getUserSelected._id);///nho sua lai truyen vaoc channl id
        }
    }

    render() {
        const { store } = this.props;
        console.log("search user");
        return (
            <div className="search-user">
                <div className="title-member">List Messenger </div>
                <div className="users">
                    {store.getListUsersSearch.map((user, index) => {
                        return (
                            <div onClick={() => this.handleClickUserChat(user, store)} key={index} className="user">
                                <div className="user-img">
                                    <img src={user.avatar} alt='avatar' />
                                </div>

                                <div className="user-info">
                                    <div>{user.name ? user.name : user.title}</div>
                                </div>
                            </div>
                        )})
                    }
                </div>
            </div>
        )
    }
}

export default SearchUser;
