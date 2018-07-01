import React, { Component } from 'react';
import Button from '../components/Button';
import { getItems, placeOrder } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Checkout from './Checkout';
import Confirmation from './Confirmation';

import { Link } from 'react-router-dom';
import {Motion, spring, presets} from 'react-motion';

import $ from 'jquery';

const BASE_URL = "http://10.0.99.62:3001" //"https://bonnie-api.dsys32.com";

class Order extends Component {
  constructor(props){
    super(props);

    this.state = {
      items: [],
      step: 0,
      orderID: ''
    };

    this.changeQuantity = this.changeQuantity.bind(this);
    this.cancelItem = this.cancelItem.bind(this);
    this.handleCheckOut = this.handleCheckOut.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  async componentWillMount(){
    console.log("component WILL mount");

    getItems((response) => {
      var items = [];
      response.data.forEach((item) => {
        items.push({
          itemId: item._id,
          category: item.category,
          title: item.name,
          description: item.description,
          price: item.price,
          quantity: 0
        });
      });
      this.setState({items: items});
    });
  }

  handleCheckOut() {
    var items = this.state.items.slice();

    for (var i = 0; i < items.length; i++) {
      if (items[i].quantity > 0) {
        this.setState({step: 1});
        return;
      }
    }
    toast('Select something before you check out!');
  }

  handleBack() {
    var step = this.state.step;

    step--;
    if (step < 0){
      return 
    }else{
      this.setState({step: step})
    }
  }

  handleConfirm() {
    var outItems = [];

    this.state.items.slice().forEach((item) => {
      outItems.push({
        _id: item.itemId,
        quantity: item.quantity
      });
    });

    placeOrder(outItems, (response) => {
      if (response.status == 200) {
        console.log(response.data._id);
        this.setState({
          orderID: new Buffer(response.data._id.toString(), 'hex').toString('base64').substring(0, 8),
          step: 2
        });
      }
    });
  }

  changeQuantity(event, id, inc, fromItem){
    event.stopPropagation();

    var itemsCopy = this.state.items.slice();

    for (var i = 0; i < itemsCopy.length; i++) {
      var item = itemsCopy[i];
      if (item.itemId == id) {
        if ((inc == -1 && item.quantity == 0) || (fromItem && itemsCopy[i].quantity > 1)) return;   // Once we've clicked on the item once, clicking on it again should not do anything
        itemsCopy[i].quantity += inc;
        if (fromItem && itemsCopy[i].quantity == 2){    // we check if the quantity is equal to 2 because if it is anything higher then we've clicked on the increment button at least once, meaning we don't want clicking the item to reset our quantity to 1
          itemsCopy[i].quantity = 1;  
        }
        break;
      }
    }

    this.setState(
      {
        items: itemsCopy
      }
    );
    
    console.log("CHANGING " + id + " " + inc);
  }

  cancelItem(event, id) {
    event.stopPropagation(); 

    var itemsCopy = this.state.items.slice();

    for (var i = 0; i < itemsCopy.length; i++) {
      var item = itemsCopy[i];
      if (item.itemId == id) {
        itemsCopy[i].quantity = 0;
        break;
      }
    }

    this.setState(
      {
        items: itemsCopy
      }
    );
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
        return <Item data = {item} changeQuantityCallback = {this.changeQuantity} cancelItemCallback = {this.cancelItem}></Item>
      })

      return <div style = {{display: "flex", flexWrap: "wrap", position: "relative", marginBottom: "25px"}}>
        <div style = {{position: "absolute", width: "25%", marginLeft: "-30%", fontSize: "20px", textAlign: "right"}}>{group}</div>
        {itemsInGroup}
      </div>
    })

    let pages = <Motion defaultStyle={{x: 0}} style={{x: spring(this.state.step, presets.stiff)}}>
      {value => <div style = {{marginLeft: (- value.x * 130) + "%", position: "relative", width: "200%"}}>
        <div style = {{position: "absolute", top: "0", left: "0", width: "50%"}}>
          <div className = "order-page" >
            {itemGroups}

            {this.state.step == 0 ? <Button style = {{width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "50px", right: "100px"}} content = "check out" callback = {() => this.handleCheckOut()}></Button> : <div><Button style = {{width: "fit-content", color : "#1c5bff", border: "3px solid", borderColor : "#1c5bff", position: "fixed", bottom: "50px", right: "300px"}} content = "back" callback = {() => this.handleBack()}></Button><Button style = {{width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "50px", right: "100px", border: "3px solid #1c5bff"}} content = "finish" callback = {() => this.handleConfirm()}></Button></div>}
            
          </div>
        </div>

        <div className = "order-page" style = {{position: "absolute", top: "0", left: "50%", width: "50%"}}>
          <div className = "order-page" style = {{paddingTop: "0"}}>
            <Checkout items = {this.state.items} changeQuantityCallback = {this.changeQuantity} cancelItemCallback = {this.cancelItem}></Checkout>
          </div>
        </div>    

        <div className = "order-page" style = {{position: "absolute", top: "0", left: "114.8%", width: "50%"}}>
          <div className = "order-page" style = {{paddingTop: "0"}}>
            <Confirmation items = {this.state.items} orderID={this.state.orderID} changeQuantityCallback = {this.changeQuantity} cancelItemCallback = {this.cancelItem}></Confirmation>
          </div>
        </div>    
    </div>}
    </Motion>

    return <div>
    
      <div style = {{position: 'fixed', top: '0', left: '0', height: '150px', width: '100%', background: "white", zIndex: "1"}}></div>

      <Motion defaultStyle={{x: 0}} style={{x: spring(this.state.step, presets.stiff)}}>
        {value => <div className = "order-steps" style = {{marginLeft: (15 - value.x * 33.5) + "%", marginBottom: "25px", width: "100%", position: "fixed", top: "80px", zIndex: '10000', left: '0'}}>
        <OrderStep content = "menu" selected = {this.state.step == 0}></OrderStep>
        <OrderStep content = "check out" selected = {this.state.step == 1}></OrderStep>
        <OrderStep content = {"confirmation" } selected = {this.state.step == 2}></OrderStep>
      </div>}
      </Motion>
      

      <div style = {{height: "70px"}}></div>

      {pages}
      <ToastContainer />
    </div>
  }
}

class Item extends Component {
  render () {
    var borderString;
    if (this.props.data.quantity > 0) {
      borderString = '3px solid #14DB88';
    } else {
      borderString = '3px solid #527aff';
    }
    
    return <div onClick = {(event) => this.props.changeQuantityCallback(event, this.props.data.itemId, 1, 1, true)} style = {{position: "relative", width: "30%", minWidth: "250px", height: "170px", border: borderString, borderRadius: "15px", padding: "15px 25px 15px 25px", marginRight: "15px",  marginBottom: "25px"}}>
      <div>
        <ItemTitle content = {this.props.data.title}></ItemTitle>
        <ItemDescription content = {this.props.data.description}></ItemDescription>
        <ItemTotalPrice price = {this.props.data.price} quantity = {this.props.data.quantity}></ItemTotalPrice>
        <ItemPrice content = {this.props.data.price}></ItemPrice>
        <ItemQuantity content = {this.props.data.quantity} itemId = {this.props.data.itemId} callback = {this.props.changeQuantityCallback}></ItemQuantity>

        {(this.props.data.quantity > 0) && <ItemCancel itemId = {this.props.data.itemId} callback =  {this.props.cancelItemCallback}></ItemCancel>}
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

class ItemTotalPrice extends Component {
  render() {
    if (this.props.quantity > 0){
      return <div style = {{fontSize: "20px", color: "rgb(26, 228, 144)", position: "absolute", bottom: "15px", right: "25px"}}>{(this.props.price * this.props.quantity).toFixed(2)}</div>
    }else{
      return <div></div>
    }
  }
}

class ItemQuantity extends Component {
  render() {
    if (this.props.content != 0){
      return <div className = "unselectable" style = {{fontSize: "17px", color: "white", position: "absolute", bottom: "15px", left: "120px", background: "#1c5bff", padding: "0px 7px 5px 7px", borderRadius: "30px"}}>
        <span style = {{marginRight: "15px", cursor: "pointer"}} onClick = {(event) => this.props.callback(event, this.props.itemId, -1)}>-</span>
        {this.props.content} 
        <span style = {{marginLeft: "15px", cursor: "pointer"}} onClick = {(event) => this.props.callback(event, this.props.itemId, 1)}>+</span>
      </div>
    }else{
      return <div></div>
    }
  }
}

class ItemCancel extends Component {
  render () {
    return <div onClick = {(event) => this.props.callback(event, this.props.itemId)} style = {{fontSize: "20px", color: "#f05056", position: "absolute", top: "20px", right: "25px"}}>
      <i className = 'material-icons' style = {{fontSize: "30px"}}>close</i>
    </div>
  }
}

class OrderStep extends Component {
  render () {
    return <div style = {{fontSize: "50px", color: this.props.selected ? "#1c5bff" : "#bbb", width: "40%"}}>{this.props.content}</div>
  }
}

export default Order;
export { Order, Item, ItemDescription, ItemTitle, ItemPrice, ItemTotalPrice, OrderStep };