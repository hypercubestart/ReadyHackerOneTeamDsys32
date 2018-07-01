import React, { Component } from 'react';

export default class Button extends Component {
  render() {
    if (!this.props.style) {
      var style = {
        marginBottom: "20px",
        width: "200px"
      };
    } else {
      var style = this.props.style;
    }

    return <div className = 'button z-depth-3'
    style = {
      style
    }
    onClick={ this.props.callback }>{this.props.content}</div>;
  }
}