import React, { Component } from 'react';

import axios from 'axios';

import { Link } from 'react-router-dom';
import {Motion, spring, presets} from 'react-motion';

import $ from 'jquery';

const BASE_URL = "http://10.0.99.62:3001" //"https://bonnie-api.dsys32.com";

class OrderPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      items: [
        {
          itemId: "djfiosje",
          category: "appetizer",
          title: "prosciutto & fig flatbread",
          description: "whipped rocatta, fig jam, prosciutto, arugula, balsamic reduction",
          price: "11.99",
          quantity: 1
        },
        {
          itemId: "djfiosjed",
          category: "appetizer",
          title: "prosciutto & fig flatbread yes",
          description: "whipped rocatta, fig jam, prosciutto, arugula, balsamic reduction",
          price: "15.99",
          quantity: 1
        },
        {
          itemId: "djfiosjedd2",
          category: "entrees",
          title: "prosciutto & fig flatbread",
          description: "whipped rocatta, fig jam, prosciutto, arugula, balsamic reduction",
          price: "15.99",
          quantity: 1
        } 
      ],
      step: 0
    };
  }

  async componentWillMount(){
    console.log("component WILL mount");

    try{
      let response = await axios(//$.get(BASE_URL + "/item/get"); /*
        {
          method: 'get',
          url: BASE_URL + '/item/get',
          withCredentials: true
      });

      console.log(response);
    } catch (error) {
      console.log(error + " in app.OrderPage.ComponentWillMount");
    }
  }

  changeQuantity(id, inc){
    this.setState(
      {

      }
    )
  }
  
  /*
  <Motion defaultStyle={{x: 0}} style={{x: spring(20,  presets.wobbly)}}>
        {value => <div style = {{marginLeft: 20 - value.x}}><input placeholder = "email" value = {this.state.email}  className = 'register-input' onChange = {this.changeEmail}></input></div>}
      </Motion>*/


  render() {
    let groups = {};
    let items = this.state.items;

    for (var i = 0; i < items.length; i++){
      if (!(items[i].category in groups)){
        groups[items[i].category] = [items[i]];
      }else{
        groups[items[i].category].push(items[i]);
      }
    }

    let itemGroups = Object.keys(groups).map((group) => {
      var itemsInGroup = groups[group].map((item) => {
        return <Item data = {item} callback = {this.changeQuantity}></Item>
      })

      return <div style = {{display: "flex", flexWrap: "wrap", position: "relative", marginBottom: "25px"}}>
        <div style = {{position: "absolute", width: "15%", marginLeft: "-15%", fontSize: "20px"}}>{group}</div>
        {itemsInGroup}
      </div>
    })

    return <div className = "order-page">
    
      <div style = {{position: 'fixed', top: '0', left: '0', height: '150px', width: '100%', background: "white", zIndex: "1"}}></div>

      <div className = "order-steps" style = {{marginBottom: "25px", position: "fixed", top: "80px", left: "15%", zIndex: '10000'}}>
        <OrderStep content = "menu" selected = {this.state.step == 0}></OrderStep>
        <OrderStep content = "check out" selected = {this.state.step == 1}></OrderStep>
        <OrderStep content = "confirmation" selected = {this.state.step == 2}></OrderStep>
      </div>

      <div style = {{height: "70px"}}></div>

      {itemGroups}

      <Button style = {{width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "50px", right: "100px"}} content = "check out" callback = {() => this.handleCreateUser()}></Button>

    </div>
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

class Item extends Component {
  render () {
    return <div style = {{position: "relative", width: "30%", minWidth: "250px", height: "170px", border: "3px solid #527aff", borderRadius: "15px", padding: "15px 25px 15px 25px", marginRight: "15px"}}>
      <div>
        <ItemTitle content = {this.props.data.title}></ItemTitle>
        <ItemDescription content = {this.props.data.description}></ItemDescription>
        <ItemPrice content = {this.props.data.price}></ItemPrice>
        <ItemQuantity content = {this.props.data.quantity} callback = {() => this.props.callback(this.props.data.itemId)}></ItemQuantity>
      </div>
    </div>
  }
}

class ItemTitle extends Component {
  render() {
    return <div style = {{fontSize: "20px", color: "black"}}>{this.props.content}</div>
  }
}

class ItemDescription extends Component {
  render() {
    return <div style = {{fontSize: "15px", color: "#aaa"}}>{this.props.content}</div>
  }
}

class ItemPrice extends Component {
  render() {
    return <div style = {{fontSize: "20px", color: "#1c5bff", position: "absolute", bottom: "15px", left: "25px"}}>{this.props.content}</div>
  }
}

class ItemQuantity extends Component {
  render() {
    return <div style = {{fontSize: "17px", color: "white", position: "absolute", bottom: "15px", left: "120px", background: "#1c5bff", padding: "0px 7px 5px 7px", borderRadius: "30px"}}>
      <span style = {{marginRight: "15px"}}>-</span> {this.props.content} <span style = {{marginLeft: "15px"}}>+</span>
    </div>
  }
}

class OrderStep extends Component {
  render () {
    return <div style = {{fontSize: "50px", color: this.props.selected ? "#1c5bff" : "#bbb", width: "40%"}}>{this.props.content}</div>
  }
}

export default OrderPage;