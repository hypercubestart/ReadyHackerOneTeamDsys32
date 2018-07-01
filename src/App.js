import React from 'react';

import Login from './login/Login';
import Register from './register/Register';
import Order from './order/Order';

import { BrowserRouter as Router, Route} from 'react-router-dom';

export default class App extends React.Component {
    render (){
        return (
            <Router>
                <div style = {{height: '100%', width: '100%'}}>
                    <Route exact path = "/login" component = {Login} />
                    <Route exact path = "/register" component = {Register} />
                    <Route exact path = "/order" component = {Order} />
                </div>
            </Router>
        )
    }

}