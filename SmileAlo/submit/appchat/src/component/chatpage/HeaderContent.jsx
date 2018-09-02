import React from 'react';
import { inject, observer } from 'mobx-react';
import '../../styles/HeaderContent.css';

@inject("store")
@observer
class HeaderContent extends React.Component {
    render() {
        console.log("Header contend");
        const { store } = this.props;
        const nameUserSelected = store.getUserSelected;
        const channel = store.getActiveChannel;
        return (
            ((!channel || channel.isNew) ?
                <div className="header-content">    
                    <div className="profile-userchat-image">
                        {!channel ? null : 
                        <img src={store.renderAvatarContent(channel)} alt="avatar" />}
                    </div>
                    <div className="profile-username">
                        <div>{store.renderTilteContent(channel)}</div>
                    </div>
                </div>
                :
                <div className="header-content-active">      
                    <div className="profile-userchat-image-active">
                        <img src={channel.avatar} alt="avatar" />
                    </div>

                    <div className="profile-username-active">
                        <div>{channel.title}</div>
                    </div>
                </div>
            )
        )
    }
}
export default HeaderContent;
