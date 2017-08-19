import { createWindow } from '../../constants';

function run(state, params, windowId) {
    var workspace = state.workspaces[state.selectedWorkspace];
    var currWindow = workspace.windows[windowId];
    var terminal = currWindow.terminal;

    if (params[0] === 'vs') {
        const sharedWidth = currWindow.width;
        currWindow.width = Math.floor(sharedWidth / 2);
        workspace.windows.push(
            createWindow(
                currWindow.x + currWindow.width,
                currWindow.y,
                Math.ceil(sharedWidth / 2),
                currWindow.height
            )
        );
    }
    else if (params[0] === 'hs') {
        const sharedHeight = currWindow.height;
        currWindow.height = Math.floor(sharedHeight / 2);
        workspace.windows.push(
            createWindow(
                currWindow.x,
                currWindow.y + currWindow.height,
                currWindow.width,
                Math.ceil(sharedHeight / 2)
            )
        );
    }
    return state;
}

export default run;
