import React, { Component } from 'react';

import { Item, ItemTitle, ItemDescription, ItemPrice, ItemTotalPrice} from './Order';

import Button from '../components/Button';
import { Link } from 'react-router-dom';

import { getUser } from '../api';

export default class Confirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: this.props.items,
      userInfo: {}
    }
  }

  componentWillMount() {
    getUser((res) => {
      this.setState({
        userInfo: res.data
      })

      console.log(res.data);
    });
  }

  render() {
    let totalCost = 0;

    let items = this.props.items;
    let itemsChosen = [];
    for (var i = 0; i < items.length; i++){
        if (items[i].quantity > 0){
            itemsChosen.push(items[i]);
            totalCost += items[i].quantity * items[i].price;
        }
    }

    console.log(items);
    console.log(itemsChosen);

    itemsChosen = itemsChosen.map((item) => {
        return <ItemReadOnly data = {item}></ItemReadOnly>
    })

    return <div>
        <div style = {{fontSize: "50px", color: "black", marginBottom: "25px"}}>here's what you got</div>
        <div style = {{display: "flex", flexWrap: "wrap"}}>
            {itemsChosen}
        </div>

        <div style = {{fontSize: "50px", color: "black", marginBottom: "0px", marginTop: "25px"}}>cost</div>
        <div style = {{fontSize: "70px", color: "rgb(26, 228, 144)"}}>
            ${totalCost}
        </div>

        <div style = {{fontSize: "50px", color: "black", marginBottom: "0px", marginTop: "25px"}}>user information</div>
        <div style = {{fontSize: "36px", color: "#527aff"}}>
            {userInfo.name}
        </div>
        <div style = {{fontSize: "36px", color: "#527aff"}}>
            {userInfo.email}
        </div>
    </div>
  }

}

class ItemReadOnly extends Component {
    render () {
      var borderString;
      if (this.props.data.quantity > 0) {
        borderString = '3px solid #14DB88';
      } else {
        borderString = '3px solid #527aff';
      }
      
      return <div style = {{position: "relative", width: "30%", minWidth: "250px", height: "170px", border: borderString, borderRadius: "15px", padding: "15px 25px 15px 25px", marginRight: "15px", marginBottom: "25px"}}>
        <div>
          <ItemTitle content = {this.props.data.title}></ItemTitle>
          <ItemDescription content = {this.props.data.description}></ItemDescription>

          <ItemTotalPrice price = {this.props.data.price} quantity = {this.props.data.quantity}></ItemTotalPrice>
          <ItemPrice content = {this.props.data.price}></ItemPrice>
          <ItemQuantityReadOnly content = {this.props.data.quantity}></ItemQuantityReadOnly>
          </div>
      </div>
    }
  }

  class ItemQuantityReadOnly extends Component {
    render() {
      if (this.props.content != 0){
        return <div className = "unselectable" style = {{fontSize: "17px", color: "white", position: "absolute", bottom: "15px", left: "120px", background: "#1c5bff", padding: "0px 7px 5px 7px", borderRadius: "30px"}}>
            qty: {this.props.content} 
        </div>
      }else{
        return <div></div>
      }
    }
  }