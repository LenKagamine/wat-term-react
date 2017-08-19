/* Merge */
function merge(a, b) {
    if (a.x === b.x && a.width === b.width && (a.y + a.height === b.y || b.y + b.height === a.y)) {
        // vertical merge
        a.y = Math.min(a.y, b.y);
        a.height += b.height;
        return true;
    }
    else if (a.y === b.y && a.height === b.height && (a.x + a.width === b.x || b.x + b.width === a.x)) {
        // horizontal merge
        a.x = Math.min(a.x, b.x);
        a.width += b.width;
        return true;
    }
    return false;
}

function run(state, params, windowId) {
    var workspace = state.workspaces[state.selectedWorkspace];
    var currWindow = workspace.windows[windowId];
    var terminal = currWindow.terminal;

    if (params[1] >= 0 && params[1] < workspace.windows.length &&
        merge(workspace.windows[windowId], workspace.windows[parseInt(params[1])])) {
        workspace.windows.splice(params[1], 1);
    }
    else {
        terminal.output.push({
            text: 'window: Cannot merge ' + params[1],
            prompt: false
        });
    }
    return state;
}

export default run;
