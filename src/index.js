import React from 'react';
import ReactDOM from 'react-dom';

import LoginCard from './App';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<LoginCard/>, document.getElementById('root'));
registerServiceWorker();
