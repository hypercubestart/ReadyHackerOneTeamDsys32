import React, { Component } from 'react';
import logo from './logo.svg';

import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css'

class LoginCard extends Component {
  render() {
    console.log("RENDERING LOGINCARD");
    return (
      <div className = "login-card valign-wrapper z-depth-3">
        <div style = {{width: "100%", textAlign: "center"}}>
          <div style = {{marginBottom: "100px", fontSize: "50px", color: "white"}}>bonnie's</div>

          <input placeholder = "email" className = 'login-input'></input>
          <input placeholder = "password" type = 'password' className = 'login-input'></input>

          <div style = {{marginBottom: "30px"}}></div>

          <Button content = "log in"></Button>
          <Button content = "register"></Button> 
        </div>
      </div>
    )
  }
}

class Button extends Component {
  render() {
    return <div className = 'button z-depth-3' style = {{marginBottom: "20px", width: "200px"}}>{this.props.content}</div>;
  }
}

export default LoginCard;