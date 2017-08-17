import { clear } from '../storage';
import env from './env';
import window from './window';
import workspace from './workspace';

function findWindow(state, id) {
    var windows = state.workspaces[state.selectedWorkspace].windows;
    for(var i = 0; i < windows.length; i++) {
        if (windows[i].id === id) {
            return i;
        }
    }
    return -1;
}

function executeCommand(state, command, params) {
    console.log(command, params);
    const windowId = findWindow(state, state.selectedWindow);
    var terminal = state.workspaces[state.selectedWorkspace].windows[windowId].terminal;

    switch(command) {
        case 'reset':
            return clear();
        case 'clear':
            terminal.output = [];
            return state;
        case 'env':
            return env(state, params, terminal);
        case 'window':
            return window(state, params, windowId);
        case 'workspace':
            return workspace(state, params, terminal);
        default:
            terminal.output.push({
                text: command + ': command not found',
                prompt: false
            });
            return state;
    }
    return state;
}

export default executeCommand;
