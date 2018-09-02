import React from 'react';
import '../../styles/Messagers.css';
import HeaderLeft from '../chatpage/HeaderLeft.jsx';
import HeaderContent from '../chatpage/HeaderContent.jsx';
import HeaderRight from '../chatpage/HeaderRight';
import SiderbarLeft from '../chatpage/SiderbarLeft';
import MenuBar from '../chatpage/MenuBar.jsx';
import MainContent from '../chatpage/MainContent.jsx';
import MessageInput from '../chatpage/MessageInput.jsx';
import SiderbarRight from '../chatpage/SiderbarRight.jsx';
import { inject, observer } from 'mobx-react';

@inject("store")
@observer
class Messagers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
        }
        this.onResize = this.onResize.bind(this);
    }

    onResize() {
        this.setState({
            height: window.innerHeigh,
        })
    }


    componentDidMount() {
        window.addEventListener('resize', this.onresize);
        // this.addTestMessages();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        const { height } = this.state;

        const style = {
            height: height,
        };
    
        return (
            <div style={style} className="app-message">
                {/*-------------------------------------------MENU---------------------------------*/}
                <MenuBar></MenuBar>
                <div className="app-wrapper">
                    <div className="header-message">
                        <HeaderLeft></HeaderLeft>
                        <HeaderContent></HeaderContent>
                        <HeaderRight></HeaderRight>
                    </div>
                    {/* ---------------------------------------MAIN----------------------------------- */}
                    <div className="main-message">
                        <SiderbarLeft></SiderbarLeft>
                        <div className="main-content">
                            <MainContent></MainContent>                          
                            <MessageInput></MessageInput>
                        </div>
                        <SiderbarRight></SiderbarRight>
                    </div>
                </div>
            </div>
        )
    }
}

export default Messagers;
