import React, { Component } from 'react';

import axios from 'axios';

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
    
    try {
      let email = this.state.email;
      let password = this.state.password;

      let response = await axios.post(BASE_URL + "/user/login", 
        {
          email: email,
          password: password
        }
      );

      console.log(response);

    } catch (error) {
      console.log(error + " in App.LoginCard.handleLogin");
    }

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

          <Button content = "log in" callback = {this.handleLogin}></Button>
          <Link to = '/register'>
            <Button content = "register"></Button>
          </Link>
        </div>
      </div>
    )
  }
}

class Button extends Component {
  render() {
    if (!this.props.style){
      var style = {marginBottom: "20px", width: "200px"};
    }else {
      var style = this.props.style;
    }
    
    return <div className = 'button z-depth-3' style = {style} onClick = {this.props.callback}>{this.props.content}</div>;
  }
}
export default Login;