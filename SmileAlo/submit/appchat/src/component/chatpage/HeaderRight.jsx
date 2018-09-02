import React from 'react';
import { inject, observer } from 'mobx-react';
import avatar from '../../image/avatar.jpg'
import Lodash from 'lodash'
import '../../styles/HeaderRight.css';
import { Modal} from 'antd';

@inject("store")
@observer
class HeaderRight extends React.Component {
    render() {
        console.log("header right");
        const { store } = this.props;
        const pic = Lodash.get(store.getCurrentUser, 'avatar');
        return (
            <div className="header-right">
                <div className="user-bar">
                    <div className="profile-image">
                        <img src={pic ? pic : avatar } alt="avatar"/>
                        <span className="user-online"></span>
                    </div>

                    <div className="profile-name">
                        {Lodash.get(store.getCurrentUser,'name')}
                    </div>
                </div>
            </div>
        )
    }
}

export default HeaderRight;