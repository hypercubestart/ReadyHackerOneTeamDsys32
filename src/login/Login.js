import React, { Component } from 'react';

import { login, loginStaff } from '../api';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const BASE_URL = "https://bonnie-api.dsys32.com"; //"http://10.0.99.62:3001"

class Login extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: "",
      password: ""
    };

    this.loginForm = React.createRef();

    this.handleLogin = this.handleLogin.bind(this);
    this.handleStaffLogin = this.handleStaffLogin.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  changeEmail(event){
    this.setState({
      email: event.target.value
    })
  }

  changePassword(event){
    this.setState({
      password: event.target.value
    })
  }

  async handleLogin(){
    this.loginForm.current.submit();
    
    let email = this.state.email;
    let password = this.state.password;

    login(email, password, (response) => {
      console.log(response);
    });
  }

  async handleStaffLogin(){
    this.loginForm.current.submit();
    
    let email = this.state.email;
    let password = this.state.password;

    loginStaff(email, password, (response) => {
      console.log(response);
    });
  }

  render() {
   

    return (
      <div className = "login-card valign-wrapper z-depth-3">
        <div style = {{width: "100%", textAlign: "center"}}>

          <form method = "POST" action = "https://bonnie-api.dsys32.com/user/login" ref = {this.loginForm}>
            <input name = 'email' placeholder = "email" value = {this.state.email} className = 'login-input' onChange = {this.changeEmail}></input>
            <input name = 'password' placeholder = "password" value = {this.state.password} type = 'password' className = 'login-input' onChange = {this.changePassword}></input>
          </form>

          <div style = {{marginBottom: "30px"}}></div>

          <Button style={{ cursor: 'pointer', marginBottom: "20px", width: "200px" }} content = "log in" callback = {this.handleLogin}></Button>

          <Button style={{ cursor: 'pointer', marginBottom: "20px", width: "200px" }} content = "as staff" callback = {this.handleStaffLogin}></Button>

          <Link to = '/register'>
            <Button content = "register"></Button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Login;