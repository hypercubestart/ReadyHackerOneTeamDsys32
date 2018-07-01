import {OrderStep} from "../order/Order";

import React, { Component } from 'react'
import io from "socket.io";

import { getOrders, getItems } from '../api';
import moment from 'moment';

export default class Admin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentOrders: [],
            tab: 0,
            items: []
        }
    }

    componentDidMount() {
        getOrders((res) => {
            console.log(res.data);

            let orders = res.data;
            this.setState({
                currentOrders: orders
            });
        });

        getItems((res) => {
          let items = res.data;

          this.setState({
            items: items
          });
        });
    }

    changeTab(tab){
        this.setState({
            tab: tab
        })
    } 

    render() {
        return(
            <div>
                <div style = {{position: "fixed", top: "0", left: "0", width: "100%", height: "200px", background: "white", zIndex: "10"}}></div>
                <div style = {{width: "70%", marginLeft: "15%", paddingTop: "240px"}}>
                    <div className = "order-steps" style = {{marginBottom: "25px", width: "100%", position: "fixed", top: "130px", zIndex: '10000', left: '0', textAlign: 'center'}}>
                        <AdminLink content = "orders" selected = {this.state.tab == 0} style = {{textAlign: "right"}} callback = {() => this.changeTab(0)}></AdminLink>
                        <AdminLink content = "menu items" selected = {this.state.tab == 1} style = {{textAlign: "center"}} callback = {() => this.changeTab(1)}></AdminLink>
                        <AdminLink content = "staff" selected = {this.state.tab == 2} style = {{textAlign: "left"}} callback = {() => this.changeTab(2)}></AdminLink>
                    </div>

                    <div>
                        <div style = {{width: "100%", display: "flex"}}>
                            <div style = {{width: "50%"}}>
                                {this.state.currentOrders.map((order) => {
                                    return <Order data = {order} availableItems={this.state.items}></Order>
                                })}
                            </div>
                            <div style = {{width: "50%"}} orders = {this.state.currentOrders}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class AdminLink extends Component {
    render () {
        var style = {fontSize: "50px", textAlign: "center", color: this.props.selected ? "#1c5bff" : "#bbb", width: "33%"};

        if (this.props.style){
            var keys = Object.keys(this.props.style);

            keys.forEach((k) => {
                style[k] = this.props.style[k]; 
            })
        }

        console.log(style);
      return <div style = {style} onClick = {this.props.callback}>{this.props.content}</div>
    }
  }

  class Order extends Component {
    
    render () {
        var timestamp = this.props.data._id.toString().substring(0,8);
        var date = new Date(parseInt(timestamp, 16) * 1000);

        var borderString = '3px solid #527aff';

        var itemNames = [];

        for (var i = 0; i < this.props.data.items.length; i++){
          var item = this.props.data.items[i];
          
          for (var j = 0; j < this.props.availableItems.length; j++) {
            if (item._id == this.props.availableItems[i]._id) {
              if (item.quantity > 1) 
                itemNames.push(this.props.availableItems[i].name + ' (x' + item.quantity + ')');
              else if (item.quantity == 1)
                itemNames.push(this.props.availableItems[i].name);
                
              break;
            }
          }
        }
        
        return <div style = {{position: "relative", width: "100%", height: "140px", background: "white", border: borderString, borderRadius: "15px", padding: "15px 25px 15px 25px", marginRight: "15px",  marginBottom: "25px"}}>
          <div>
            <div style = {{fontSize: "20px", color: "black"}}>{this.props.data.user.name}: {new Buffer(this.props.data._id.toString(), 'hex').toString('base64').substring(0, 8)}</div>

             <div style = {{fontSize: "20px", color: "#bbb", position: "absolute", top: "15px", right: "25px"}}>{moment(parseInt(timestamp, 16) * 1000).fromNow()}</div>
           
             <div style = {{position: "absolute", right: "-70px", top: "-3px", background: "#f05056", height: "calc(100% + 6px)", width: "90px", border: "3px #f05056 solid", borderRadius: "15px", zIndex: '-1'}}>
                <div className = "material-icons valign-wrapper" style = {{position: "absolute", fontSize: "50px", top: "40px", right: "10px", color: "white", width: "fit-content"}}>close</div>
             </div>
             <div style = {{position: "absolute", right: "-130px", top: "-3px", background: "rgb(26, 228, 144)", height: "calc(100% + 6px)", width: "170px", border: "3px rgb(26, 228, 144) solid", borderRadius: "15px", zIndex: '-2'}}>
                <div className = "material-icons valign-wrapper" style = {{position: "absolute", fontSize: "50px", top: "40px", right: "0px", color: "white", width: "fit-content"}}>check</div>
             </div>
             
          </div>
        </div>
      }
  }