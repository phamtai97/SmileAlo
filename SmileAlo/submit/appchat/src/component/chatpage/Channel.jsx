import React from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import lodash from 'lodash';
import '../../styles/SiderbarLeft.css';
import iconcancel from '../../image/iconcancel.png';

@inject("store")
@observer
class Channel extends React.Component{
    constructor(props){
        super(props);
        this.cancelChannel = this.cancelChannel.bind(this);
    }

    cancelChannel(){
        const {store, channel} = this.props;
        store.onCancelChannel(channel._id);
    }

    render(){
        const {store, channel} = this.props;
        const currenntMessage = store.getCurrentMessage;
        const nameUserChat = store.getUserSelected;
        const size = store.messages.size; 
        return(
            <div onClick={() => {
                store.setActiveChannelId(channel._id);
            }} key={channel._id} className={classNames('channel', { 'channel-active': lodash.get(store.getActiveChannel, '_id') === channel._id })}>
                <div className="user-image">
                    <img src={channel.avatar} alt="avatar" />
                </div>
                    
                <div className="channel-info">
                    <div>{channel.title}</div>
                    <p>{channel.lastMessage}</p>
                </div>

                <div className="number-messagewait">
                    {channel.numberOfMessageWait > 0 ? 
                        <p>{channel.numberOfMessageWait > 100 ? "99+" : channel.numberOfMessageWait}</p>
                        :
                        null
                    }
                </div>
                <div>
                    {channel.isNew ? 
                    <div className='cancel'>
                        <img src={iconcancel} alt="avatar" onClick={this.cancelChannel}/>
                    </div>
                    :
                    null}
                </div>
            </div>
        )
    }
}

export default Channel;
