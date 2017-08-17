function run(state, params, terminal) {
    if (params.length === 1) {
        if (params[0] === 'add') {
            state.workspaces.push({
                windows: [{
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    id: +new Date(),
                    terminal: {
                        history: [''],
                        inProg: false,
                        output: [],
                        runningCommand: '',
                        workingDirectory: '~'
                    }
                }]
            });
        }
        else {
            terminal.output.push({
                text: 'workspace: Unknown parameter ' + params[0],
                prompt: false
            });
        }
    }
    else if (params.length === 2) {
        if (params[0] === 'remove') {
            state.workspaces.splice(params[1], 1);
        }
        else {
            terminal.output.push({
                text: 'workspace: Unknown parameter ' + params[0],
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
