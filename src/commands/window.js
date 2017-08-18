import { createWindow } from '../constants';

/* Shift */
// the following commands either returns a list of windows that are exact
//   borders of the given index, or false if there are none
function borderingComp(index, windows, borderingComp, boundaryComp1, boundaryComp2) {
    var borderingWindows = [];
    const a = windows[index];
    for (var i = 0; i < windows.length; i++) {
        if (i !== index) {
            const b = windows[i];
            if (borderingComp(a, b)) {
                // Bordering
                if (boundaryComp1(a, b)) {
                    borderingWindows.push(i);
                }
                else if (!boundaryComp2(a, b)) {
                    // Borders on edge but exceeds limit.
                    return false;
                    continue;
                }
            }
        }
    }
    if (borderingWindows.length === 0) {
        return false;
    }
    return borderingWindows;
}

function getBorderingLeft(index, windows) {
    return borderingComp(index, windows,
        function(a, b) { return b.x + b.width == a.x; },
        function(a, b) { return b.y >= a.y && b.y + b.height <= a.y + a.height; },
        function(a, b) { return b.y >= a.y + a.height || b.y + b.height <= a.y; });
}

function getBorderingRight(index, windows) {
    return borderingComp(index, windows,
        function(a, b) { return b.x == a.x + a.width; },
        function(a, b) { return b.y >= a.y && b.y + b.height <= a.y + a.height; },
        function(a, b) { return b.y >= a.y + a.height || b.y + b.height <= a.y; });
}

function getBorderingTop(index, windows) {
    return borderingComp(index, windows,
        function(a, b) { return b.y + b.height == a.y; },
        function(a, b) { return b.x >= a.x && b.x + b.width <= a.x + a.width; },
        function(a, b) { return b.x >= a.x + a.width || b.x + b.width <= a.x; });
}

function getBorderingBottom(index, windows) {
    return borderingComp(index, windows,
        function(a, b) { return b.y == a.y + a.height; },
        function(a, b) { return b.x >= a.x && b.x + b.width <= a.x + a.width; },
        function(a, b) { return b.x >= a.x + a.width || b.x + b.width <= a.x; });
}

// edge is one of left, right, top, or bottom
// c is 1 for +, -1 for -
function getChangeMatrix(edge, c) {
    // c is current, r is rest, d is delta
    // returns [dcx, dcy, dcw, dch, drx, dry, drw, drh]
    if (edge === 'left') {
        return [-c, 0, c, 0, 0, 0, -c, 0];
    }
    else if (edge === 'right') {
        return [0, 0, c, 0, c, 0, -c, 0];
    }
    else if (edge === 'top') {
        return [0, -c, 0, c, 0, 0, 0, -c];
    }
    else {
        return [0, 0, 0, c, 0, c, 0, -c];
    }
}

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

    if (params.length === 1) { // vs, hs
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
        else {
            terminal.output.push({
                text: 'window: Unknown parameter ' + params[0],
                prompt: false
            });
        }
    }
    else if (params.length === 2) {
        if (params[0] === 'merge') {
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
        }
        else if (params[0] === 'left' || params[0] === 'right' || params[0] === 'top' || params[0] === 'bottom') {
            var result;
            if (params[0] === 'left') {
                result = getBorderingLeft(windowId, workspace.windows);
            }
            else if (params[0] === 'right') {
                result = getBorderingRight(windowId, workspace.windows);
            }
            else if (params[0] === 'top') {
                result = getBorderingTop(windowId, workspace.windows);
            }
            else if (params[0] === 'bottom') {
                result = getBorderingBottom(windowId, workspace.windows);
            }

            if (!result) {
                terminal.output.push({
                    text: 'window: Cannot shift ' + params[1] + ' border',
                    prompt: false
                });
            }
            else {
                const change = params[1] === '+' ? 1 :
                               params[1] === '-' ? -1 :
                               parseInt(params[1]);

                const c = getChangeMatrix(params[0], change);
                currWindow.x += c[0];
                currWindow.y += c[1];
                currWindow.width += c[2];
                currWindow.height += c[3];
                result.map(function(id) {
                    workspace.windows[id].x += c[4];
                    workspace.windows[id].y += c[5];
                    workspace.windows[id].width += c[6];
                    workspace.windows[id].height += c[7];
                });
            }
        }
        else {
            terminal.output.push({
                text: 'window: Unknown parameter ' + params[0],
                prompt: false
            });
        }
    }
    else {
        terminal.output.push({
            text: 'env: Incorrect number of parameters',
            prompt: false
        });
    }
    return state;
}

export default run;
