function run(state, params, windowId) {
    var workspace = state.workspaces[state.selectedWorkspace];
    var currWindow = workspace.windows[windowId];
    var terminal = currWindow.terminal;

    if (params.length === 1) { // vs, hs
        if (params[0] === 'vs') {
            const sharedWidth = currWindow.width;
            currWindow.width = Math.floor(sharedWidth / 2);
            const newWindow = {
                x: currWindow.x + currWindow.width,
                y: currWindow.y,
                width: Math.ceil(sharedWidth / 2),
                height: currWindow.height,
                id: +new Date(),
                terminal: {
                    history: [''],
                    inProg: false,
                    output: [],
                    runningCommand: '',
                    workingDirectory: '~'
                }
            }
            workspace.windows.push(newWindow);
        }
        else if (params[0] === 'hs') {
            const sharedHeight = currWindow.height;
            currWindow.height = Math.floor(sharedHeight / 2);
            const newWindow = {
                x: currWindow.x,
                y: currWindow.y + currWindow.height,
                width: currWindow.width,
                height: Math.ceil(sharedHeight / 2),
                id: +new Date(),
                terminal: {
                    history: [''],
                    inProg: false,
                    output: [],
                    runningCommand: '',
                    workingDirectory: '~'
                }
            }
            workspace.windows.push(newWindow);
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
