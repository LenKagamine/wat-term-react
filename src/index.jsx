import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import reducers from './reducers';

import Storage from './storage';
import App from './containers/app.jsx';
import Constants, {createFile} from './constants';
import { getDirectory, getFile } from './utils';

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

    window.getState = () => store.getState();

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    );

    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        if (event.origin + '/' === Constants.WAT_TERM_CONTENT_URL) {
            const message = event.data;
            const parts = event.data.split("|");
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
            else if (parts[0] === 'requestFile') {
                const result = getFile(message.substring(message.indexOf('|') + 1), store.getState().wfs);
                let contents = '';
                if (result !== false) {
                    contents = result[0].data;
                }
                event.source.postMessage('file|' + contents, event.origin);
            }
            else if (parts[0] === 'writeFile') {
                createOrModifyFileAtPath(parts[1], message.split('|').slice(2).join('|'), store.getState().wfs);
            }
        }
    }

});

function createOrModifyFileAtPath(path, contents, wfs) {
    let fileObject = getFile(path, wfs);
    const parts = path.split("/");
    if (fileObject === false) {
        // Need to Create
        let enclosingDir = getDirectory(path.substring(0, path.lastIndexOf("/")), state.wfs);
        if (enclosingDir !== false) {
            let newFile = createFile(parts[parts.length - 1]);
            newFile.data = contents;
            enclosingDir[0].data.push(newFile);
        }
    }
    else {
        fileObject[0].data = contents;
    }
}
