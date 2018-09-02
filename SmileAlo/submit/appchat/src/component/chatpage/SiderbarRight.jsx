import React from 'react';
import { inject, observer } from 'mobx-react';
// import moment from 'moment';
// import lodash from 'lodash';
import '../../styles/SiderbarRight.css';
// import classNames from 'classnames';
import Member from '../chatpage/Member.jsx';

@inject("store")
@observer
class SiderbarRight extends React.Component {
    
    render() {
        const {store} = this.props;    
        console.log("siderbar right");
        const nameUserChat = store.getUserSelected;
        const activeChannel = store.getActiveChannel;
        // const listUsersOnline = store.getListUsersOnline;
        return (
            <div className="siderbar-right">
                    {store.getSizeMembersInChannel(activeChannel) > 1 ?
                        <div className="members">
                            <div className="title-member">Members </div>
                            {store.getMembersFromChannel(activeChannel).map((member, index) => {
                                return(
                                    <Member key={index} member={member}></Member>
                                )        
                            })
                        }
                    </div>
                    :
                    <h2 className="title-member">
                        Members
                    </h2>
                }
            </div>
        )
    }
}
export default SiderbarRight;
