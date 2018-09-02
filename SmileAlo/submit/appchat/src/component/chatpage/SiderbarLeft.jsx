import React from 'react';
import { inject, observer } from 'mobx-react';
import Channel from '../chatpage/Channel.jsx';
import '../../styles/SiderbarLeft.css';

@inject("store")
@observer
class SiderbarLeft extends React.Component {
    render() {
        const {store} = this.props;
        console.log("siderbar-left")
        return (
            <div className="siderbar-left">
                <div className="title-member">Messenger </div>
                <div className="channels">
                    {store.getChannels.map((channel, index) => {
                        return (
                            <Channel key={index} channel={channel}></Channel>
                        );
                    })}
                </div>
            </div>
        )
    }
}
export default SiderbarLeft;
