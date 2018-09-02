import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from "react-router-dom"
import '../../styles/HeaderLeft.css';

@inject("store")
@observer
class HeaderLeft extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.onLogoutApp = this.onLogoutApp.bind(this);
    }

    onLogoutApp() {
        const { store } = this.props;
        this.props.history.push('/');
        store.logoutApp();
    }

    handleSearch() {
        const { store } = this.props;
        if (store.getNameUserSearch && store.getNameUserSearch.trim().length > 0) {
            store.setShowComponentSearch(true);
            store.searchNameUserChat().then((result) => {
                store.setListUsersSearch(result);
                store.setNameUserSearch('');                
            }).catch((err) => {
                if (err === 403) {
                    this.onLogoutApp();
                }
                if (err === 404) {
                    store.clearListUsersSearch();
                }
            })
        } else {
            store.setNameUserSearch('');
        }
    }

    render() {
        console.log("header left");
        const { store } = this.props;

        return (
            <div className="header-left">
                <div className="search">
                    <div className="input-search">
                        <input onKeyUp={(event) => {
                            if (event.key === 'Enter') {
                                    this.handleSearch();
                                }
                            }}                     
                            onChange={(event) => {
                                store.setNameUserSearch(event.target.value );
                            }} value={store.getNameUserSearch} placeholder="Search messager..."
                        />
                    </div>
                    <div className="action-search">
                        <button onClick={this.handleSearch}>Search</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(HeaderLeft);
