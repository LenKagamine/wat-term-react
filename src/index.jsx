import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import reducers from './reducers';

import Storage from './storage';
import App from './containers/app.jsx';

// Storage.clear();
Storage.load(newState => {
    console.log(newState);
    let store = createStore(reducers, newState);

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    );
});
