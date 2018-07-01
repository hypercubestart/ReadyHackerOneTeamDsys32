import {OrderStep} from "../order/Order";

import React, { Component } from 'react'
import io from "socket.io";

export default class Admin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentOrders: []
        }
    }

    componentDidMount() {
        
    }

    render() {
        return(
            <div style = {{width: "70%", marginLeft: "15%", paddingTop: "150px"}}>
                <div className = "order-steps" style = {{marginBottom: "25px", width: "100%", position: "fixed", top: "80px", zIndex: '10000', left: '0'}}>
                    <OrderStep content = "menu" selected = {this.state.step == 0}></OrderStep>
                    <OrderStep content = "check out" selected = {this.state.step == 1}></OrderStep>
                    <OrderStep content = "confirmation" selected = {this.state.step == 2}></OrderStep>
                </div>
            </div>
        )
    }
}