import React from 'react';

import Login from './login/App';
import Register from './register/App';
import OrderPage from './order/App';

import { BrowserRouter as Router, Route} from 'react-router-dom';

export default class App extends React.Component {
    render (){
        return (
            <Router>
                <div style = {{height: '100%', width: '100%'}}>
                    <Route exact path = "/login" component = {Login} />
                    <Route exact path = "/register" component = {Register} />
                    <Route exact path = "/order" component = {OrderPage} />
                </div>
            </Router>
        )
    }

}