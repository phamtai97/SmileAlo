import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Login.css'
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import { Form, Icon, Input } from 'antd';
import { inject, observer} from 'mobx-react';
import lodash from 'lodash';
import 'antd/dist/antd.css';
const FormItem = Form.Item;

@inject('store')
@observer 
class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                message: null,
                userName: '',
                password: '',
            }
        }

    }

    handleSubmit = (e) => {
        let { user } = this.state;
        const { store } = this.props;
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                user.userName = values.userName;
                user.password = values.password;
                this.setState({
                    user: user,
                })

                this.setState({message: null}, () => {
                    store.loginApp(user.userName, user.password).then((user) => {
                        this.setState({
                            message: null,
                        })
                        this.props.history.push('/chat');
                    }).catch((err) => {     
                        if(err === 401){
                            this.setState({
                                message: {
                                    body: 'Login failed',
                                    type: 'error', 
                                }
                            })
                        }
                    });
                })    
            }
        });
        
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { message } = this.state;
        return (
            <CSSTransitionGroup 
                transitionName="aminMoveDown"
                transitionAppear={true}
                transitionAppearTimeout={800}
                transitionEnterTimeout={0}
                transitionLeaveTimeout={300}>
                <div className="containerLoginPage">
                    <div className="main">
                        <CSSTransitionGroup 
                            transitionName="aminAppear"
                            transitionAppear={true}
                            transitionAppearTimeout={800}
                            transitionEnterTimeout={0}
                            transitionLeaveTimeout={300}>
                            <h1 className="titleLogin">Login</h1>
                        </CSSTransitionGroup>
                        <Form onSubmit={this.handleSubmit} className="form" method="post">
                            <FormItem>
                                <div>
                                    {getFieldDecorator('userName', { rules: [{ required: true, message: 'Please input your username!' }], })
                                        (<Input prefix={<Icon type="user" />} placeholder="Username" />)}
                                </div>
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('password', { rules: [{ required: true, message: 'Please input your Password!' }], })
                                    (<Input prefix={<Icon type="lock" />} type="password" placeholder="Password" />)}
                            </FormItem>

                            <FormItem>
                                <div>
                                    <button id="buttonLogin" type="submit">Login</button>
                                    <Link to="/register"><button id="buttonRegister" type="submit">Register</button></Link>
                                </div>
                            </FormItem>
                            {message ? <p className='noti-message'>{lodash.get(message, 'body')}</p>
                            : null
                            }
                        </Form>                      
                    </div>
                </div>
            </CSSTransitionGroup>
        );
    }
}

export default Form.create()(LoginPage);
