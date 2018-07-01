import React, { Component } from 'react';

import axios from 'axios';

import { Link } from 'react-router-dom';

class Login extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: "",
      password: ""
    };

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

  async handleLogin(email, password){
    try {
      let response = await axios.post("/user/login", 
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
    let email = this.state.email;
    let password = this.state.password;

    return (
      <div className = "login-card valign-wrapper z-depth-3">
        <div style = {{width: "100%", textAlign: "center"}}>

          <input placeholder = "email" value = {this.state.email} className = 'login-input' onChange = {this.changeEmail}></input>

          <input placeholder = "password" value = {this.state.password} type = 'password' className = 'login-input' onChange = {this.changePassword}></input>

          <div style = {{marginBottom: "30px"}}></div>

          <Button content = "log in" callback = {(email, password) => this.handleLogin(email, password)}></Button>
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
    return <div className = 'button z-depth-3' style = {{marginBottom: "20px", width: "200px"}} onClick = {this.props.callback}>{this.props.content}</div>;
  }
}

export default Login;