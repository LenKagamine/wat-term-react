import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import reducers from './reducers';

import Storage from './storage';
import App from './containers/app.jsx';
import Constants, {createFile} from './constants';

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
            var message = event.data;
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
            else if (parts[0] === 'requestFile') {
                var result = getFile(message.substring(message.indexOf('|') + 1), store.getState().wfs);
                var contents = '';
                if (result !== false) {
                    contents = result[0].data;
                }
                event.source.postMessage('file|' + contents, event.origin);
            }
            else if (parts[0] === 'writeFile') {
                message = message.substring(message.indexOf('|') + 1);
                createOrModifyFileAtPath(parts[1],
                        message.substring(message.indexOf('|') + 1), store.getState().wfs);
            }
        }
    }

});


function getFile(path, currDir) {
    var end = path.lastIndexOf("/");
    if (end === -1) return false;

    var parts = path.split("/");
    var filename = parts[parts.length - 1];
    var containingDirRes = getDirectory(path.substring(0, end), currDir);
    if (containingDirRes === false) return false;

    var containingPath = containingDirRes[1];
    var containingDir = containingDirRes[0];
    for (var j = 0; j < containingDir.data.length; j++) {
        if (containingDir.data[j].type === Constants.FILE_TYPE &&
            containingDir.data[j].name === filename) {
            return [containingDir.data[j], containingPath + "/" + filename];
        }
    }
    return false;
}

function getDirectory(directory, currDir) {
    var parts = directory.split('/');
    var dirStack = [currDir];
    for (var i = 1; i < parts.length; i++) {
        if (parts === "" || parts === ".") continue;
        if (parts[i] === "..") {
            currDir = dirStack[dirStack.length - 1];
            if (dirStack.length != 1) {
                dirStack.pop();
            }
            continue;
        }
        else if (parts[i] == "~") {
            // Go Back to Root
            while (dirStack.length != 1) {
                dirStack.pop();
            }
            continue;
        }
        var found = -1;
        for (var j = 0; j < currDir.data.length; j++) {
            // Found it
            if (currDir.data[j].name === parts[i] && currDir.data[j].type === Constants.DIR_TYPE) {
                found = j;
                break;
            }
        }
        if (found != -1) {
            dirStack.push(currDir.data[j])
        }
        else {
            return false;
        }
        currDir = dirStack[dirStack.length - 1];
    }
    var path = "";
    for (var i = 0; i < dirStack.length; i++) {
        if (i != 0) path += "/";
        path += dirStack[i].name;
    }
    return [currDir, path];
}

function createOrModifyFileAtPath(path, contents, wfs) {
    var fileObject = getFile(path, wfs);
    console.log(fileObject);
    var parts = path.split("/");
    if (fileObject == false) {
        // Need to Create
        var enclosingDir = getDirectory(path.substring(0, path.lastIndexOf("/")), wfs);
        if (enclosingDir != false) {
            var newFile = createFile(parts[parts.length - 1]);
            newFile.data = contents;
            enclosingDir[0].data.push(newFile);
        }
    }
    else {
        fileObject[0].data = contents;
    }
}
