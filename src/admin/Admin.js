import {OrderStep} from "../order/Order";

import React, { Component } from 'react'
import exportFromJSON from 'export-from-json'

import { getOrders, getItems, getStaff, cancelOrder, fulfillOrder, exportOrders, addItem } from '../api';
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

    fulfillOrderIntermediate = (id) => {
      fulfillOrder(id, (response) => {
        this.fetchOrders();
      });
    }

    cancelOrderIntermediate = (id) => {
      cancelOrder(id, (response) => {
        this.fetchOrders();
      });
    }

    exportOrders = () => {
      const fileName = 'orders'
      const exportType = 'json'
 
      exportOrders((response) => {
        exportFromJSON({ data: response.data, fileName, exportType })
      });
    }

    handleAddItem = (name, description, price, category, picture) => {
        addItem(name, description, price, category, picture, (res)=>{
            getItems((res) => {
                console.log(this.state.items); 
                let items = res.data;
        
                this.setState({
                  items: items
                });

                console.log(this.state.items); 

                this.forceUpdate();
              });
        });
    };

    handleAddStaff = () => {

    };

    fetchOrders = () => {
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

        console.log(this.state.currentOrders);
        console.log("^^^^");
      });
    }

    componentDidMount() {
      this.fetchOrders();
      setInterval(this.fetchOrders, 2500);

      getItems((res) => {
        let items = res.data;
        console.log(this.state.items); 

        this.setState({
          items: items
        });
        
        console.log(this.state.items); 
      });
    }

    changeTab(tab){
        this.setState({
            tab: tab
        })
    }

    render() {
        console.log("RERENDERING");
        var page;
        if (this.state.tab == 0){
            page = <div>
                <div style = {{position: "fixed", left: '0', top: '0', width: "100%", height: "220px", background: "white", zIndex: "100"}}></div>
                <div style = {{width: "140%", marginLeft: "-20%", display: "flex", zIndex: "0"}}>
                    <div style = {{width: "50%", zIndex: "10"}}>
                        {this.state.currentOrders.map((order) => {
                            if (order.status == 0){
                                return <Order status = {order.status} data = {order} availableItems={this.state.items} fulfillOrder={this.fulfillOrderIntermediate} cancelOrder={this.cancelOrderIntermediate}></Order>
                            }else{
                                return <Order status = {order.status} data = {order} availableItems={this.state.items} fulfillOrder={this.fulfillOrderIntermediate} cancelOrder={this.cancelOrderIntermediate}></Order>

                            }
                        })}
                    </div>
                    <div style = {{width: "50%"}} orders = {this.state.currentOrders}></div>
                     <Button content = 'export orders' style = {{zIndex: "100000000000000000000000", width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "50px", right: "100px"}} callback = {() => {this.exportOrders()}}></Button>
                </div>
            </div>;
        }else if (this.state.tab == 2){
            page = <div>
                <div style = {{width: "100%"}}>
                    <StaffPage></StaffPage>
                </div>
            </div>
        }else if (this.state.tab == 1){
            page = <div>
                <div style = {{width: "100%"}}>
                    <ItemPage items = {this.state.items} uploadItemCallback = {this.handleAddItem}></ItemPage>
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
    
        this.toggleAddMember = this.toggleAddMember.bind(this);
    }
    
    toggleAddMember(){
        console.log("YAY");
        this.setState({
            addingMember: !this.state.addingMember
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
        return <div style = {{display: "flex", flexWrap: "wrap"}}>
            {this.state.staff.map((member) => {
                return <div style = {{width: "45%", marginLeft: "2.5%", height: "140px", border: "3px #1c5bff solid", borderRadius: "15px", padding: "15px", marginBottom: "15px"}}>
                    <Staff data = {member}></Staff>
                    <Button content = 'new staff' style = {{width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "50px", right: "100px"}} callback = {() => this.toggleAddMember()}></Button>

                </div>
            })}

            {this.state.addingMember && <StaffCreateForm></StaffCreateForm>}
           
        </div>
    }
}

class ItemPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
    
            addingItem: false
        }
    
        this.toggleAddItem = this.toggleAddItem.bind(this);
    }
    
    toggleAddItem(){
        this.setState({
            addingItem: ! this.state.addingItem
        })
    }

    hideAddItem() {
        this.setState({
            addingItem: false
        })
    }

//{this.state.addingItem && <ItemCreateForm></ItemCreateForm>}
    render() {
        return <div style = {{display: "flex", flexWrap: "wrap"}}>
            {this.props.items.map((item) => {
                return <div style = {{position: "relative", width: "30%", minWidth: "250px", height: "170px", border: "#1c5bff 3px solid", borderRadius: "15px", padding: "15px 25px 15px 25px", marginRight: "15px",  marginBottom: "25px"}}>
                    <Item data = {item}></Item>
                </div>
            })}

            <Button content = 'add item' style = {{width: "fit-content", color : "white", background : "#1c5bff", position: "fixed", bottom: "50px", right: "100px"}} callback = {this.toggleAddItem}></Button>
           
           {this.state.addingItem && <ItemCreateForm uploadItemCallback = {this.props.uploadItemCallback}></ItemCreateForm>}
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

class Item extends Component {
    render() {
        return <div>
            <div style = {{fontSize: "20px"}}>{this.props.data.name}</div>
            <div style = {{fontSize: "15px", color: "#ccc"}}>{this.props.data.description}</div>
            <div style = {{fontSize: "15px", color: "#ccc"}}>popularity: {this.props.data.popularity}</div>
        </div>
    }
}

class StaffCreateForm extends Component {
    render () {
        return <div className = "z-depth-3" style = {{position: "fixed", top: "15%", left: "15%", width: "70%", height: "70%", background: "white", padding: "30px", zIndex: "10000", borderRadius: "15px"}}>
            <div style = {{width: "100%", textAlign: "center", color: "#1c5bff", fontSize: "50px"}}>new staff</div>
        </div> 
    }
}

class ItemCreateForm extends Component {
    constructor (props){
        super(props);

        this.state = {
            "name" : "",
            "description" : "",
            "category" : "",
            "price" : ""
        }

        this.file = React.createRef()
    }
;

    handleAddItem = () =>{
        var name = this.state.name;
        var description = this.state.description;
        var category = this.state.category;
        var price = this.state.price;
        var file = this.file.current.files[0];

        console.log(this.state);
        console.log(price);

        this.props.uploadItemCallback(name, description, price, category, file, (data) => {
            console.log(data);
        });
    }

    handleChange = (event, key) => {
        this.setState({
            [key]: event.target.value
        })
    }

    render () {
        return <div className = "z-depth-3" style = {{position: "fixed", top: "15%", left: "15%", width: "70%", height: "70%", background: "white", padding: "30px", zIndex: "10000", borderRadius: "15px"}}>
            <div style = {{width: "100%", textAlign: "center", color: "#1c5bff", fontSize: "50px", marginBottom: "50px"}}>new item</div>
            <input name = 'name' type = 'text' placeholder = 'name' className = 'form-input' onChange = {(e) => this.handleChange(e, 'name')}></input>
            <input name = 'name' type = 'text' placeholder = 'description' className = 'form-input' onChange = {(e) => this.handleChange(e, 'description')}></input>
            <input name = 'name' type = 'text' placeholder = 'category' className = 'form-input' onChange = {(e) => this.handleChange(e, 'category')}></input>
            <input name = 'name' type = 'text' placeholder = 'price' className = 'form-input' onChange = {(e) => this.handleChange(e, 'price')}></input>
            <input name = 'name' type = 'file' placeholder = 'Click to upload file' className = 'form-input' ref = {this.file}></input>

            <Button style = {{width: "fit-content", color : "white", background : "#1c5bff"}} content = "add item" callback = {this.handleAddItem}></Button>
        </div> 
    }
}

  class Order extends Component {
    
    _cancelOrder = () => {
        cancelOrder()
    }

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
        
        var style = {position: "relative", width: "70%", height: "fit-content", minHeight: "140px", background: "white", border: borderString, borderRadius: "15px", padding: "15px 25px 15px 25px", marginRight: "15px",  marginBottom: "25px", zIndex: "0"}

        console.log(this.props.status + " THIS IS STATUS");
        if (this.props.status != 0){
            style["marginLeft"] = '100%'
        }else{
            style['marginLeft'] = '30%';
        }

        if (this.props.status == 1){
            style['borderColor'] = '#f05056';
            style['color'] = 'white';
        }

        if (this.props.status == 2){
            style['borderColor'] = 'rgb(26, 228, 144)';
            style['color'] = 'black';
        }

        return <div style = {style}>
          <div>
            <div style = {{fontSize: "20px", color: "black"}}>{this.props.data.user.name}: {new Buffer(this.props.data._id.toString(), 'hex').toString('base64').substring(0, 8)}</div>
              {
                itemNames.map((name) => {
                  return <div style = {{fontSize: "20px", color: "#bbb"}}>{name}</div>
                })
              }
             <div style = {{fontSize: "20px", color: "#bbb", position: "absolute", top: "15px", right: "25px"}}>{moment(parseInt(timestamp, 16) * 1000).fromNow()}</div>
   
         
              { this.props.status == 0 &&
              
                <div>
                        <div style = {{position: "absolute", right: "0px", top: "-3px", background: "white", height: "calc(100% + 6px)", width: "90px", zIndex: 1000000, borderRadius: "0px 15px 15px 0px", border: "3px solid #527aff", borderLeftStyle: "none", zIndex: '-1'}} >
                
             </div>
<div className = "cancel-order-button" style = {{position: "absolute", right: "-70px", top: "-3px", background: "#f05056", height: "calc(100% + 6px)", width: "90px", zIndex: 1000000, border: "3px #f05056 solid", borderRadius: "15px", zIndex: '-2'}} onClick = {() => {this.props.cancelOrder(this.props.data._id)}}>
                <div className = "material-icons valign-wrapper" style = {{position: "absolute", fontSize: "50px", top: "40px", right: "10px", color: "white", width: "fit-content"}}>close</div>
             </div>
             <div className = "fulfill-order-button" style = {{position: "absolute", right: "-130px", top: "-3px", background: "rgb(26, 228, 144)", height: "calc(100% + 6px)", width: "170px", border: "3px rgb(26, 228, 144) solid", borderRadius: "15px", zIndex: '-3'}} onClick = {() => {this.props.fulfillOrder(this.props.data._id)}}>
                <div className = "material-icons valign-wrapper" style = {{position: "absolute", fontSize: "50px", top: "40px", right: "0px", color: "white", width: "fit-content"}}>check</div>
             </div></div>
              }
             
             
          </div>
        </div>
      }
  }