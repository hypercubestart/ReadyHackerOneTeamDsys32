import React, { Component } from 'react';

import axios from 'axios';

import { Link } from 'react-router-dom';
import {Motion, spring, presets} from 'react-motion';

class Register extends Component {
  constructor(props){
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      nameError: false,
      emailError: true
    };

    this.changeName = this.changeName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.toggleShowPassword = this.toggleShowPassword.bind(this);
  }

  changeName(event) {
    this.setState({
      name: event.target.value
    })
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

  toggleShowPassword(){
    this.setState({
      showingPassword: !this.state.showingPassword
    })
  }

  async handleCreateUser(email, password){
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

    let emailForm;
    if (this.state.emailError){
      emailForm = <Motion defaultStyle={{x: 0}} style={{x: spring(20,  presets.wobbly)}}>
        {value => <div style = {{marginLeft: 20 - value.x}}><input placeholder = "email" value = {this.state.email}  className = 'register-input' onChange = {this.changeEmail}></input></div>}
      </Motion>
    }else{
      emailForm = <input placeholder = "email" value = {this.state.email} className = 'register-input' onChange = {this.changeEmail}></input>
    }

    return (
      <div className = "register-page" style = {{padding: "100px 0px 50px 0px", width: "70%", marginLeft: "15%"}}>
        <div style = {{width: "100%"}}>
          <div style = {{fontSize: "50px", marginBottom: "50px", marginLeft: "-85px"}}>
              <Link to = "/login"><i className = 'material-icons' style = {{fontSize: "50px", color: "black", verticalAlign: "middle", marginRight: "25px"}}>arrow_back</i></Link> register
          </div>

          <input placeholder = "name" value = {this.state.name} className = 'register-input' onChange = {this.changeName}></input>

          {emailForm}

          <div style = {{marginLeft: "-80px"}}>
            <i className = 'material-icons' style = {{fontSize: "30px", height: "50px", color: this.state.password ? "#7c95e9" : "#527aff", verticalAlign: "middle", marginRight: "50px"}} onClick = {this.toggleShowPassword}>remove_red_eye</i>
            <input placeholder = "password" value = {this.state.password} type = {this.state.showingPassword ? 'text' : 'password'} className = 'register-input' onChange = {this.changePassword}></input>
          </div>

          <div style = {{marginBottom: "30px"}}></div>

          <Button style = {{width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "100px", left: "15%"}} content = "get started!" callback = {(email, password) => this.handleLogin(email, password)}></Button>
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

export default Register;