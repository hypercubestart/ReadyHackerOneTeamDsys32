import {OrderStep} from "../order/Order";

import React, { Component } from 'react'
import io from "socket.io";
import exportFromJSON from 'export-from-json'

import { getOrders, getItems, getStaff, cancelOrder } from '../api';
import Button from "../components/Button";
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

    exportOrders = () => {
      const fileName = 'orders'
      const exportType = 'json'
 
      exportFromJSON({ data: this.state.currentOrders, fileName, exportType })
    }

    componentDidMount() {
        getOrders((res) => {
            console.log(res.data);

            let orders = res.data;

            orders.forEach((order, index, orders) => {
              if (order.fulfilledTime) orders[index].status = 2;
              else if (order.cancelledTime) orders[index].status = 1;
              else orders[index].status = 0;
            }); 

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
        var page;
        if (this.state.tab == 0){
            page = <div>
                <div style = {{width: "140%", marginLeft: "-20%", display: "flex"}}>
                    <div style = {{width: "50%"}}>
                        {this.state.currentOrders.map((order) => {
                            return <Order data = {order} availableItems={this.state.items}></Order>
                        })}
                    </div>
                    <div style = {{width: "50%"}} orders = {this.state.currentOrders}></div>
                     <Button content = 'export orders' style = {{width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "50px", right: "100px"}} callback = {() => {this.exportOrders()}}></Button>
                </div>
            </div>;
        }else if (this.state.tab == 2){
            page = <div>
                <div style = {{width: "100%"}}>
                    <StaffPage></StaffPage>
                </div>
            </div>
        }else if (this.state.tab == 3){
            page = <div>
                <div style = {{width: "100%"}}>
                    <ItemPage></ItemPage>
                </div>
            </div>
        }

        return(
            <div>
                <div style = {{position: "fixed", top: "0", left: "0", width: "100%", height: "200px", background: "white", zIndex: "10"}}></div>
                <div style = {{width: "70%", marginLeft: "15%", paddingTop: "240px"}}>
                    <div className = "order-steps" style = {{marginBottom: "25px", width: "100%", position: "fixed", top: "130px", zIndex: '10000', left: '0', textAlign: 'center'}}>
                        <AdminLink content = "orders" selected = {this.state.tab == 0} style = {{textAlign: "right"}} callback = {() => this.changeTab(0)}></AdminLink>
                        <AdminLink content = "menu items" selected = {this.state.tab == 1} style = {{textAlign: "center"}} callback = {() => this.changeTab(1)}></AdminLink>
                        <AdminLink content = "staff" selected = {this.state.tab == 2} style = {{textAlign: "left"}} callback = {() => this.changeTab(2)}></AdminLink>
                    </div>

                    {page}

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

class StaffPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            staff: [],
            addingMember: false
        }
    
        this.showAddMember = this.showAddMember.bind(this);
    }
    
    showAddMember(){
        this.setState({
            addingMember: true
        })
    }

    hideAddMember() {
        this.setState({
            addingMember: false
        })
    }

    componentWillMount(){
        getStaff((res) => {
            console.log(res.data);

            let staff = res.data;
            this.setState({
                staff: staff
            });
        });
    }



    render() {
        return <div style = {{}}>
            {this.state.staff.map((member) => {
                return <div style = {{width: "45%", marginLeft: "2.5%", height: "140px", border: "3px #1c5bff solid", borderRadius: "15px", padding: "15px"}}>
                    <Staff data = {member}></Staff>
                    <Button content = 'new staff' style = {{width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "50px", right: "100px"}} onClick = {this.showAddMember}></Button>

                    {this.state.addingMember && <StaffCreateForm></StaffCreateForm>}
                </div>
            })}
           
        </div>
    }
}

class ItemPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            items: [],
            addingItem: false
        }
    
        this.showAddItem = this.showAddItem.bind(this);
    }
    
    showAddItem(){
        this.setState({
            addingItem: true
        })
    }

    hideAddItem() {
        this.setState({
            addingItem: false
        })
    }

    componentWillMount(){
        getItems((res) => {
            console.log(res.data);

            let items = res.data;
            this.setState({
                items: items
            });
        });
    }

    render() {
        return <div style = {{}}>
            {this.state.staff.map((member) => {
                return <div style = {{width: "45%", marginLeft: "2.5%", height: "140px", border: "3px #1c5bff solid", borderRadius: "15px", padding: "15px"}}>
                    <Staff data = {member}></Staff>
                    <Button content = 'export orders' style = {{width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "50px", right: "100px"}} onClick = {this.showAddMember}></Button>

                    {this.state.addingMember && <StaffCreateForm></StaffCreateForm>}
                </div>
            })}
           
        </div>
    }
}


class Staff extends Component {
    render() {
        return <div>
            <div style = {{fontSize: "35px"}}>{this.props.data.name}</div>
            <div style = {{fontSize: "25px", color: "#ccc"}}>{this.props.data.email}</div>
        </div>
    }
}

class StaffCreateForm extends Component {
    render () {
        return <div className = "z-depth-3" style = {{position: "fixed", top: "15%", left: "15%", width: "70%", height: "70%", background: "white", padding: "30px"}}>
            <div style = {{width: "100%", textAlign: "center", color: "#1c5bff", fontSize: "50px"}}>new staff</div>
        </div> 
    }
}

  class Order extends Component {
    
    render () {
        var timestamp = this.props.data._id.toString().substring(0,8);
        var date = new Date(parseInt(timestamp, 16) * 1000);

        var borderString = '3px solid #527aff';

        var itemNames = [];
        console.log(this.props.availableItems);

        for (var i = 0; i < this.props.data.items.length; i++){
          var item = this.props.data.items[i];
          
          for (var j = 0; j < this.props.availableItems.length; j++) {
            if (item._id == this.props.availableItems[j]._id) {
              if (item.quantity > 1) 
                itemNames.push(this.props.availableItems[j].name + ' (x' + item.quantity + ')');
              else if (item.quantity == 1)
                itemNames.push(this.props.availableItems[j].name);
                
              break;
            }
          }
        }

        console.log(itemNames);
        
        return <div style = {{position: "relative", width: "70%", height: "fit-content", minHeight: "140px", background: "white", border: borderString, borderRadius: "15px", padding: "15px 25px 15px 25px", marginRight: "15px",  marginBottom: "25px"}}>
          <div>
            <div style = {{fontSize: "20px", color: "black"}}>{this.props.data.user.name}: {new Buffer(this.props.data._id.toString(), 'hex').toString('base64').substring(0, 8)}</div>
              {
                itemNames.map((name) => {
                  return <div style = {{fontSize: "20px", color: "#bbb"}}>{name}</div>
                })
              }
             <div style = {{fontSize: "20px", color: "#bbb", position: "absolute", top: "15px", right: "25px"}}>{moment(parseInt(timestamp, 16) * 1000).fromNow()}</div>
           
             <div className = "cancel-order-button" style = {{position: "absolute", right: "-70px", top: "-3px", background: "#f05056", height: "calc(100% + 6px)", width: "90px", border: "3px #f05056 solid", borderRadius: "15px", zIndex: '-1'}} onClick = {() => {}}>
                <div className = "material-icons valign-wrapper" style = {{position: "absolute", fontSize: "50px", top: "40px", right: "10px", color: "white", width: "fit-content"}}>close</div>
             </div>
             <div className = "fulfill-order-button" style = {{position: "absolute", right: "-130px", top: "-3px", background: "rgb(26, 228, 144)", height: "calc(100% + 6px)", width: "170px", border: "3px rgb(26, 228, 144) solid", borderRadius: "15px", zIndex: '-2'}}>
                <div className = "material-icons valign-wrapper" style = {{position: "absolute", fontSize: "50px", top: "40px", right: "0px", color: "white", width: "fit-content"}}>check</div>
             </div>
             
          </div>
        </div>
      }
  }