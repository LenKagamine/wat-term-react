// import { combineReducers } from 'redux';

// import { combineReducers } from 'redux'
// import * as reducers from './reducers'
//
// const todoApp = combineReducers(reducers)

import executeCommand from '../commands';
import { save } from '../storage';

function findWindow(state, id) {
    var windows = state.workspaces[state.selectedWorkspace].windows;
    for(var i = 0; i < windows.length; i++) {
        if (windows[i].id === id) {
            return i;
        }
    }
    return -1;
}

const rootReducer = function (state = {}, action) {
    if (action.type !== 'UPDATE_COMMAND') console.log(action);
    switch(action.type) {
        case 'SELECT_WINDOW': {
            var newState = JSON.parse(JSON.stringify(state));
            newState.selectedWindow = action.id;
            return newState;
        }
        case 'SELECT_WORKPLACE': {
            var newState = JSON.parse(JSON.stringify(state));
            newState.selectedWorkspace = action.id;
            newState.selectedWindow = newState.workspaces[action.id].windows[0].id;
            return newState;
        }
        case 'UPDATE_COMMAND': {
            // Split into smaller reducers later
            var newState = JSON.parse(JSON.stringify(state));
            const index = findWindow(newState, newState.selectedWindow);
            newState.workspaces[newState.selectedWorkspace].windows[index].terminal.history[action.index] = action.text;
            return newState;
        }
        case 'EXECUTE_COMMAND': {
            var newState = JSON.parse(JSON.stringify(state));
            const index = findWindow(newState, newState.selectedWindow);
            var newTerminal = newState.workspaces[newState.selectedWorkspace].windows[index].terminal;
            newTerminal.history[newTerminal.history.length - 1] = action.text;
            newTerminal.output.push({
                text: action.text,
                prompt: true
            });
            newTerminal.history.push('');
            return executeCommand(newState, action.text);
        }
        // case 'STORAGE_CHANGED': {
        //     return action.data;
        // }
        default:
            return state;
    }
}

const saveWrapper = function (state, action) {
    const newState = rootReducer(state, action);
    save(newState);
    return newState;
}

export default saveWrapper;
