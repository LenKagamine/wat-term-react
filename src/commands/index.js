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

function Script(state, command, params) {
    this.windowId = findWindow(state, state.selectedWindow);
    this.workspace = state.workspaces[state.selectedWorkspace];
    this.currWindow = this.workspace.windows[this.windowId];
    this.terminal = this.currWindow.terminal;
    this.output = function(text, showPrompt = false, showCommand = true) {
        this.terminal.output.push({
            text: (showCommand ? command + ': ' : '') + text,
            prompt: (showPrompt ? this.terminal.workingDirectory : '')
        });
    }
    this.execute = function(run) {
        return run.call(this, state, params, this.windowId);
    }
}

function executeCommand(state, text) {
    const [command, ...params] = parseInput(text);
    console.log(command, params);
    const windowId = findWindow(state, state.selectedWindow);

    var script = new Script(state, command, params);

    switch(command) {
        case 'reset':
            return clear();
        case 'clear':
            state.workspaces[state.selectedWorkspace].windows[windowId].terminal.output = [];
            return state;
        case 'env':
            return script.execute(env);
        case 'window':
            return script.execute(window);
        case 'workspace':
            return script.execute(workspace);
        case 'cd':
            return script.execute(cd);
        case 'ls':
            return script.execute(ls);
        case 'mkdir':
            return script.execute(mkdir);
        case 'cat':
            return script.execute(cat);
        default:
            script.output('command not found');
            return state;
    }
    return state;
}

export default executeCommand;
