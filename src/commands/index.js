import { clear } from '../storage';
import env from './env';
import window from './window';
import workspace from './workspace';

import cd from './files/cd';
import mkdir from './files/mkdir';
import ls from './files/ls';
import cat from './files/cat';

function findWindow(state, id) {
    var windows = state.workspaces[state.selectedWorkspace].windows;
    for(var i = 0; i < windows.length; i++) {
        if (windows[i].id === id) {
            return i;
        }
    }
    return -1;
}

function parseInput(text) {
    return text.trim().match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)
                      .map(t => t.replace(/^"|"$/g, "").replace(/^'|'$/g, ""));
}

function executeCommand(state, text) {
    const [command, ...params] = parseInput(text);
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
        case 'cd':
            return cd(state, params, windowId);
        case 'ls':
            return ls(state, params, windowId);
        case 'mkdir':
            return mkdir(state, params, windowId);
        case 'cat':
            return cat(state, params, windowId);
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
