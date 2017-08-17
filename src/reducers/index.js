// import { combineReducers } from 'redux';

// import { combineReducers } from 'redux'
// import * as reducers from './reducers'
//
// const todoApp = combineReducers(reducers)

const rootReducer = function (state = {}, action) {
    console.log(action);
    switch(action.type) {
        case 'UPDATE_COMMAND': {
            // Split into smaller reducers later
            var newState = JSON.parse(JSON.stringify(state));
            newState.workspaces[newState.selectedWorkspace].windows[newState.selectedWindow].terminal.history[action.index] = action.text;
            return newState;
        }
        case 'EXECUTE_COMMAND': {
            var newState = JSON.parse(JSON.stringify(state));
            var newTerminal = newState.workspaces[newState.selectedWorkspace].windows[newState.selectedWindow].terminal;
            newTerminal.history[newTerminal.history.length - 1] = action.text;
            newTerminal.output.push(action.text);
            newTerminal.history.push('');
            // action.text
            const parts = action.text.split(' ');
            return executeCommand(newState, parts[0], parts.slice(1));
        }
        default:
            return state;
    }
}

function executeCommand(state, command, params) {
    console.log(command, params);
    return state;
}

export default rootReducer;
