import React, { Component } from 'react'
import io from 'socket.io-client'

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
                <div></div>
            </div>
        )
    }
}