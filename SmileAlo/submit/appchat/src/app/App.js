import React, { Component } from 'react';
import LoginPage from '../component/loginpage/LoginPage.jsx';
import RegisterPage from '../component/register/RegisterPage.jsx';
import Messagers from '../component/chatpage/Messagers';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Provider } from 'mobx-react';
import store from '../store/Store.js';

import { BrowserRouter } from 'react-router-dom';
import '../styles/App.css';

class App extends Component {
  render() {
    return (       
      <BrowserRouter> 
        <Provider store={store}>
          <div className="App">        
            <Route exact path="/" component={LoginPage}/>
            <Route path="/register" component={RegisterPage}/> 
            <Route path="/chat" component={Messagers}/>     
          </div>
          </Provider>
      </BrowserRouter>

    );
  }
}

export default App;
