// import { combineReducers } from 'redux';

// import { combineReducers } from 'redux'
// import * as reducers from './reducers'
//
// const todoApp = combineReducers(reducers)

const rootReducer = function (state = {}, action) {
    console.log(action);
    switch(action.type) {
        case 'MOVE_HISTORY_UP': {
            var newState = JSON.parse(JSON.stringify(state));
            var index = newState.workspaces[newState.selectedWorkspace].windows[newState.selectedWindow].terminal.historyIndex;
            if (index > 0) {
                newState.workspaces[newState.selectedWorkspace].windows[newState.selectedWindow].terminal.historyIndex--;
            }
            return newState;
        }
        case 'MOVE_HISTORY_DOWN': {
            var newState = JSON.parse(JSON.stringify(state));
            var index = newState.workspaces[newState.selectedWorkspace].windows[newState.selectedWindow].terminal.historyIndex;
            var len = newState.workspaces[newState.selectedWorkspace].windows[newState.selectedWindow].terminal.history.length;
            if (index < len - 1) {
                newState.workspaces[newState.selectedWorkspace].windows[newState.selectedWindow].terminal.historyIndex++;
            }
            return newState;
        }
        case 'UPDATE_COMMAND': {
            // Split into smaller reducers later
            var newState = JSON.parse(JSON.stringify(state));
            const historyIndex = newState.workspaces[newState.selectedWorkspace].windows[newState.selectedWindow].terminal.historyIndex;
            newState.workspaces[newState.selectedWorkspace].windows[newState.selectedWindow].terminal.history[historyIndex] = action.text;
            return newState;
        }
        default:
            return state;
    }
}

export default rootReducer;
