import React from 'react';
import '../../styles/Login.css'
import { Link } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import { Form, Icon, Input } from 'antd';
import {inject, observer} from 'mobx-react';
import avatar from '../../image/avatar.jpg'
import lodash from 'lodash';
import 'antd/dist/antd.css';
const FormItem = Form.Item;


@inject('store')
@observer class RegisterPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            pic: null,
            message: null,
            user: {
                name: '',
                userName: '',
                password: '',
                avatar: '',
            }
        }
    }
    
    comparePassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    handleSubmit = (e) => {
        let user = {};
        const { store } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                user.name = values.fullName;
                user.userName = values.userName;
                user.password = values.password;
                user.avatar = values.linkAvatar;
                this.setState({
                    user: user,
                })
                store.register(user).then((user) => {
                    this.props.history.push('/chat');
                }).catch((err) => {
                    if(err === 400){
                        this.setState({
                            message: {
                                body: 'Register failed',
                                type: 'error', 
                            }
                        })
                    }
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {pic, message} = this.state;
        
        return (
            <CSSTransitionGroup
                transitionName="aminMoveDown"
                transitionAppear={true}
                transitionAppearTimeout={800}
                transitionEnterTimeout={0}
                transitionLeaveTimeout={300}>
                
                <div className="containerRegisterPage">
                    <div className="main">
                        <CSSTransitionGroup 
                            transitionName="aminAppear"
                            transitionAppear={true}
                            transitionAppearTimeout={900}
                            transitionEnterTimeout={0}
                            transitionLeaveTimeout={300}>
                            <h1 className="titleRegister">Register</h1>
                        </CSSTransitionGroup>

                        <Form onSubmit={this.handleSubmit} className="form">
                            <div className="avatar">
                                <img src={pic ? pic : avatar } alt="avatar" />
                            </div>

                            <FormItem>
                                {getFieldDecorator('linkAvatar', { rules: [{ required: true, message: 'Please input your link avatar!' }], })
                                (<Input prefix={<Icon type="linkAvatar" style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="Link avatar" onChange={(event) => {
                                    this.setState({pic: event.target.value})
                                }}/>)}
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('fullName', { rules: [{ required: true, message: 'Please input your fullname!' }], })
                                    (<Input prefix={<Icon type="fullName" style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="Fullname" />)}
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('userName', { rules: [{ required: true, message: 'Please input your username!' }], })
                                    (<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />)}
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('password', { rules: [{ required: true, message: 'Please input your Password!' }]})
                                    (<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />)}
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('confirmpasword', { rules: [{ required: true, message: 'Please input your Confirm pasword!' },
                                                                        {validator: this.comparePassword}] })
                                    (<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirm pasword" />)}
                            </FormItem>

                            <FormItem>
                                <button id="buttonSignUp" type="submit">Sin up</button>
                                <Link to="/"><button id="buttonCancel" type="submit">Cancel</button></Link>
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

export default Form.create()(RegisterPage);
