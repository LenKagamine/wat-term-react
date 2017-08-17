import { clear } from '../storage';

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
    const index = findWindow(state, state.selectedWindow);
    var terminal = state.workspaces[state.selectedWorkspace].windows[index].terminal;

    switch(command) {
        case 'reset':
            return clear();
        case 'clear':
            terminal.output = [];
            return state;
        case 'env':
            if (params.length === 1) {
                terminal.output.push({
                    text: state.wsh.env[params[0]],
                    prompt: false
                });
            }
            else if (params.length === 2) {
                state.wsh.env[params[0]] = params[1];
            }
            else {
                terminal.output.push({
                    text: command + ': Incorrect number of parameters',
                    prompt: false
                });
            }
            return state;
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
