import merge from './merge';
import split from './split';
import shift from './shift';

function run(state, params, windowId) {
    var workspace = state.workspaces[state.selectedWorkspace];
    var currWindow = workspace.windows[windowId];
    var terminal = currWindow.terminal;

    switch(params[0]) {
        case 'vs':
        case 'hs':
            return split(state, params, windowId);
        case 'merge':
            return merge(state, params, windowId);
        case 'left':
        case 'right':
        case 'top':
        case 'bottom':
            return shift(state, params, windowId);
        default:
            terminal.output.push({
                text: 'window: Unknown parameter ' + params[0],
                prompt: false
            });
            return state;
    }
}

export default run;
