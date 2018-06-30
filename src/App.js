import React from 'react';

import Login from './login/App';

import { BrowserRouter as Router, Route} from 'react-router-dom';

export default class App extends React.Component {
    render (){
        return (
            <Router>
                <div style = {{height: '100%', width: '100%'}}>
                    <Route exact path = "/login" component = {Login} />
                </div>
            </Router>
        )
    }

}