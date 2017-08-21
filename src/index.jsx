import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import reducers from './reducers';

import Storage from './storage';
import App from './containers/app.jsx';
import Constants from './constants';

// Storage.clear();
Storage.load(newState => {
    console.log(newState);
    let store = createStore(reducers, newState);
    // chrome.storage.onChanged.addListener((changes, namespace) => {
    //     store.dispatch({
    //         type: 'STORAGE_CHANGED',
    //         data: changes['state'].newValue
    //     });
    // });

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    );

    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        console.log(event);
        if (event.origin + '/' === Constants.WAT_TERM_CONTENT_URL) {
            const message = event.data;
            const parts = event.data.split("|");
            console.log(event.data);
            if (parts[0] === 'done') {
                store.dispatch({
                    type: 'KILL_SCRIPT',
                    id: parts[1]
                });
            }
            else if (parts[0] === 'env') {
                store.dispatch({
                    type: 'SET_ENV',
                    key: parts[1],
                    value: parts[2]
                });
            }
            // else if (parts[0] === 'requestFile') {
            //     var result = getFile(message.substring(message.indexOf("|") + 1));
            //     var contents = "";
            //     if (result !== false) {
            //         contents = result[0].data;
            //     }
            //     event.source.postMessage("file|" + contents, event.origin);
            // }
            // else if (parts[0] === 'writeFile') {
            //     message = message.substring(message.indexOf("|") + 1);
            //     createOrModifyFileAtPath(parts[1],
            //             message.substring(message.indexOf("|") + 1));
            // }
        }
    }

});
