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
    var newState = JSON.parse(JSON.stringify(state));

    const index = findWindow(state, state.selectedWindow);
    var newTerminal = newState.workspaces[newState.selectedWorkspace].windows[index].terminal;

    switch(action.type) {
        case 'SELECT_WINDOW': {
            return {
                ...state,
                selectedWindow: action.id
            };
        }
        case 'SELECT_WORKPLACE': {
            return {
                ...state,
                selectedWorkspace: action.id,
                selectedWindow: state.workspaces[action.id].windows[0].id
            };
        }
        case 'UPDATE_COMMAND': {
            // Split into smaller reducers later
            newTerminal.history[action.index] = action.text;
            return newState;
        }
        case 'EXECUTE_COMMAND': {
            newTerminal.history[newTerminal.history.length - 1] = action.text;
            newTerminal.history.push('');

            newTerminal.output.push({
                text: action.text,
                prompt: state.wsh.env.prompt.replace('%w', newTerminal.workingDirectory)
            });

            return executeCommand(newState, action.text);
        }
        case 'KILL_SCRIPT': {
            var scriptIndex = findWindow(newState, parseInt(action.id));
            newState.workspaces[newState.selectedWorkspace].windows[scriptIndex].terminal.inProg = false;
            return newState;
        }
        case 'SET_ENV': {
            state.wsh.env[action.key] = action.value;
            return state;
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
