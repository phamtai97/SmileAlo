import React from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import '../../styles/SiderbarRight.css';
import classNames from 'classnames';
import iconcancel from '../../image/iconcancel.png';

@inject("store")
@observer
class Member extends React.Component {
    constructor(props) {
        super(props);
        this.cancelMember = this.cancelMember.bind(this);
    }

    cancelMember(){
        const {store, member} = this.props;
        const activeChannel = store.getActiveChannel;
        store.removeMemberToChannel(activeChannel, member);
        store.setUserSelected(member);
    }

    render() {
        console.log()
        const {store, member} = this.props;
        const isOnline = store.listUsersOnline.get(member._id);
        const activeChannel = store.getActiveChannel;
        return (
            <div key={activeChannel._id} className="member">
                <div className="user-image">
                    <img src={member.avatar} alt="avatar" />
                    <span className={classNames('user-offline', { 'user-online': isOnline })}></span>
                </div>
                <div className="member-info">
                    <div>{member.name}</div>
                    <p>Join: {moment(activeChannel.created).fromNow()}</p>
                </div>
                <div>
                    {activeChannel.isNew ? 
                    <div className='cancel'>
                        <img src={iconcancel} alt="avatar" onClick={this.cancelMember}/>
                    </div>
                    :
                    null}
                </div>
            </div>
        )
    }
}

export default Member;
