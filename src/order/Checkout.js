import React, { Component } from 'react';

import axios from 'axios';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: this.props.items
    }
  }

  render() {
    
  }

}