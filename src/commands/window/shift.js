/* Shift */
// the following commands either returns a list of windows that are exact
//   borders of the given index, or false if there are none
function borderingComp(index, windows, borderingComp, boundaryComp1, boundaryComp2) {
    let borderingWindows = [];
    const a = windows[index];
    for (let i = 0; i < windows.length; i++) {
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
        function(a, b) { return b.x + b.width === a.x; },
        function(a, b) { return b.y >= a.y && b.y + b.height <= a.y + a.height; },
        function(a, b) { return b.y >= a.y + a.height || b.y + b.height <= a.y; });
}

function getBorderingRight(index, windows) {
    return borderingComp(index, windows,
        function(a, b) { return b.x === a.x + a.width; },
        function(a, b) { return b.y >= a.y && b.y + b.height <= a.y + a.height; },
        function(a, b) { return b.y >= a.y + a.height || b.y + b.height <= a.y; });
}

function getBorderingTop(index, windows) {
    return borderingComp(index, windows,
        function(a, b) { return b.y + b.height === a.y; },
        function(a, b) { return b.x >= a.x && b.x + b.width <= a.x + a.width; },
        function(a, b) { return b.x >= a.x + a.width || b.x + b.width <= a.x; });
}

function getBorderingBottom(index, windows) {
    return borderingComp(index, windows,
        function(a, b) { return b.y === a.y + a.height; },
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

function run(state, params, windowIndex) {
    let result;
    if (params[0] === 'left') {
        result = getBorderingLeft(windowIndex, this.workspace.windows);
    }
    else if (params[0] === 'right') {
        result = getBorderingRight(windowIndex, this.workspace.windows);
    }
    else if (params[0] === 'top') {
        result = getBorderingTop(windowIndex, this.workspace.windows);
    }
    else if (params[0] === 'bottom') {
        result = getBorderingBottom(windowIndex, this.workspace.windows);
    }

    if (result) {
        const change = params[1] === '+' ? 1 :
                       params[1] === '-' ? -1 :
                       parseInt(params[1]);

        const c = getChangeMatrix(params[0], change);
        this.currWindow.x += c[0];
        this.currWindow.y += c[1];
        this.currWindow.width += c[2];
        this.currWindow.height += c[3];
        result.map(id => {
            this.workspace.windows[id].x += c[4];
            this.workspace.windows[id].y += c[5];
            this.workspace.windows[id].width += c[6];
            this.workspace.windows[id].height += c[7];
        });
    }
    else {
        this.output('Cannot shift ' + params[1] + ' border');
    }
    return state;
}

export default run;
